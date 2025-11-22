import express from 'express';
import { Op } from 'sequelize';
import Tree from '../models/Tree.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { body, validationResult, query } from 'express-validator';

const router = express.Router();

// Get all trees (public)
router.get('/', [
  query('minLat').optional().isFloat(),
  query('maxLat').optional().isFloat(),
  query('minLng').optional().isFloat(),
  query('maxLng').optional().isFloat(),
  query('species').optional().trim(),
  query('status').optional().isIn(['planted', 'growing', 'mature', 'deceased'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { minLat, maxLat, minLng, maxLng, species, status } = req.query;
    const where = {};

    // Bounding box filter
    if (minLat && maxLat && minLng && maxLng) {
      where.latitude = {
        [Op.between]: [parseFloat(minLat), parseFloat(maxLat)]
      };
      where.longitude = {
        [Op.between]: [parseFloat(minLng), parseFloat(maxLng)]
      };
    }

    // Species filter
    if (species) {
      where.species = {
        [Op.like]: `%${species}%`
      };
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    const trees = await Tree.findAll({
      where,
      include: [{
        model: User,
        as: 'addedByUser',
        attributes: ['id', 'username'],
        required: false
      }],
      order: [['datePlanted', 'DESC']]
    });

    // Format response to match expected structure
    const formattedTrees = trees.map(tree => ({
      _id: tree.id,
      ...tree.toJSON(),
      addedBy: tree.addedByUser ? {
        _id: tree.addedByUser.id,
        username: tree.addedByUser.username
      } : null
    }));

    res.json(formattedTrees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single tree
router.get('/:id', async (req, res) => {
  try {
    const tree = await Tree.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'addedByUser',
        attributes: ['id', 'username'],
        required: false
      }]
    });
    if (!tree) {
      return res.status(404).json({ error: 'Tree not found' });
    }
    
    const formattedTree = {
      _id: tree.id,
      ...tree.toJSON(),
      addedBy: tree.addedByUser ? {
        _id: tree.addedByUser.id,
        username: tree.addedByUser.username
      } : null
    };
    
    res.json(formattedTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create tree (requires auth)
router.post('/', authenticateToken, [
  body('species').notEmpty().trim(),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('planterName').notEmpty().trim(),
  body('datePlanted').optional().isISO8601(),
  body('status').optional().isIn(['planted', 'growing', 'mature', 'deceased'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const treeData = {
      ...req.body,
      addedBy: req.user.userId
    };

    const tree = await Tree.create(treeData);
    await tree.reload({
      include: [{
        model: User,
        as: 'addedByUser',
        attributes: ['id', 'username'],
        required: false
      }]
    });

    const formattedTree = {
      _id: tree.id,
      ...tree.toJSON(),
      addedBy: tree.addedByUser ? {
        _id: tree.addedByUser.id,
        username: tree.addedByUser.username
      } : null
    };

    res.status(201).json(formattedTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tree (requires auth, admin for others' trees)
router.put('/:id', authenticateToken, [
  body('species').optional().notEmpty().trim(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
  body('status').optional().isIn(['planted', 'growing', 'mature', 'deceased'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tree = await Tree.findByPk(req.params.id);
    if (!tree) {
      return res.status(404).json({ error: 'Tree not found' });
    }

    // Check permissions
    if (tree.addedBy !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this tree' });
    }

    await tree.update(req.body);
    await tree.reload({
      include: [{
        model: User,
        as: 'addedByUser',
        attributes: ['id', 'username'],
        required: false
      }]
    });

    const formattedTree = {
      _id: tree.id,
      ...tree.toJSON(),
      addedBy: tree.addedByUser ? {
        _id: tree.addedByUser.id,
        username: tree.addedByUser.username
      } : null
    };

    res.json(formattedTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete tree (requires admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tree = await Tree.findByPk(req.params.id);
    if (!tree) {
      return res.status(404).json({ error: 'Tree not found' });
    }
    await tree.destroy();
    res.json({ message: 'Tree deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalTrees = await Tree.count();
    
    const byStatus = await Tree.findAll({
      attributes: [
        'status',
        [Tree.sequelize.fn('COUNT', Tree.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const bySpecies = await Tree.findAll({
      attributes: [
        'species',
        [Tree.sequelize.fn('COUNT', Tree.sequelize.col('id')), 'count']
      ],
      group: ['species'],
      order: [[Tree.sequelize.literal('count'), 'DESC']],
      limit: 10
    });

    const statusMap = {};
    byStatus.forEach(item => {
      statusMap[item.status] = parseInt(item.dataValues.count);
    });

    const topSpecies = bySpecies.map(item => ({
      _id: item.species,
      count: parseInt(item.dataValues.count)
    }));

    res.json({
      totalTrees,
      byStatus: statusMap,
      topSpecies
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
