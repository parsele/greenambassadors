import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import Tree from '../models/Tree.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for CSV upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// CSV Upload endpoint
router.post('/csv', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    const errors = [];
    let rowNumber = 0;

    // Parse CSV
    const stream = Readable.from(req.file.buffer.toString());
    
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          rowNumber++;
          try {
            // Validate required fields
            if (!row.species || !row.latitude || !row.longitude || !row.planterName) {
              errors.push({
                row: rowNumber,
                error: 'Missing required fields: species, latitude, longitude, planterName'
              });
              return;
            }

            // Parse and validate data
            const treeData = {
              species: row.species.trim(),
              latitude: parseFloat(row.latitude),
              longitude: parseFloat(row.longitude),
              planterName: row.planterName.trim(),
              planterEmail: row.planterEmail?.trim() || '',
              datePlanted: row.datePlanted ? new Date(row.datePlanted) : new Date(),
              status: row.status?.trim() || 'planted',
              notes: row.notes?.trim() || '',
              photoUrl: row.photoUrl?.trim() || '',
              addedBy: req.user.userId
            };

            // Validate coordinates
            if (isNaN(treeData.latitude) || treeData.latitude < -90 || treeData.latitude > 90) {
              errors.push({ row: rowNumber, error: 'Invalid latitude' });
              return;
            }
            if (isNaN(treeData.longitude) || treeData.longitude < -180 || treeData.longitude > 180) {
              errors.push({ row: rowNumber, error: 'Invalid longitude' });
              return;
            }

            results.push(treeData);
          } catch (error) {
            errors.push({ row: rowNumber, error: error.message });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insert trees into database
    let inserted = 0;
    let failed = 0;

    if (results.length > 0) {
      try {
        // Use bulkCreate for better performance
        const createdTrees = await Tree.bulkCreate(results, {
          validate: true,
          individualHooks: false
        });
        inserted = createdTrees.length;
      } catch (error) {
        // Try inserting one by one to identify problematic rows
        for (const treeData of results) {
          try {
            await Tree.create(treeData);
            inserted++;
          } catch (err) {
            failed++;
            errors.push({ row: 'unknown', error: err.message });
          }
        }
      }
    }

    res.json({
      success: true,
      totalRows: rowNumber,
      inserted,
      failed,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download CSV template
router.get('/csv-template', (req, res) => {
  const template = 'species,latitude,longitude,planterName,planterEmail,datePlanted,status,notes,photoUrl\n' +
    'Acacia tortilis,-2.6531,37.2531,John Doe,john@example.com,2024-01-15,planted,Healthy tree,\n' +
    'Balanites aegyptiaca,-2.6541,37.2541,Jane Smith,jane@example.com,2024-01-16,growing,Good growth,';
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=tree-upload-template.csv');
  res.send(template);
});

export default router;
