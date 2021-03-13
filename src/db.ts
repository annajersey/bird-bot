import { DataTypes, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const sequelize = new Sequelize('process.env.DB_NAME',
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: true,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });

export const Currency = sequelize.define('currency', {
  userID: {
    type: DataTypes.STRING,
    unique: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export const Options = sequelize.define('options', {
  key: {
    type: DataTypes.STRING,
    unique: true,
  },
  value: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },
});
