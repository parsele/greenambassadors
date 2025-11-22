import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Tree = sequelize.define('Tree', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  datePlanted: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  planterName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  planterEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  status: {
    type: DataTypes.ENUM('planted', 'growing', 'mature', 'deceased'),
    defaultValue: 'planted'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'trees',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['latitude', 'longitude']
    },
    {
      fields: ['date_planted']
    }
  ]
});

// Define associations
Tree.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
User.hasMany(Tree, { foreignKey: 'addedBy' });

export default Tree;
