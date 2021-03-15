import { DataTypes, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
let generalChatId = '';
const sequelize = new Sequelize(
    process.env.DB_NAME!,
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
  },
);

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

export const DBinit = async () => {
  await Currency.sync();
  await Options.sync();
  const findGeneralChatId = await Options.findOne({ where: { key: 'generalChatId' } });
  if (findGeneralChatId) generalChatId = findGeneralChatId.get('value') as string;
};

export const updateGeneralChatId = async (newGeneralChatID:string) => {
  const findChatId = await Options.findOne({ where: { key: 'generalChatId' } });

  if (!findChatId) {
    await Options.create({
      key: 'generalChatId',
      value: newGeneralChatID,
    });
  } else if (findChatId.get('value') !== newGeneralChatID) {
    await Options.update({ value: newGeneralChatID }, { where: { key: 'generalChatId' } });
    generalChatId = newGeneralChatID;
  }
};

export const getGeneralChatId = () => generalChatId;
