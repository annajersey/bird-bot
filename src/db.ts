import { DataTypes, Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { GENERAL_CHAT_KEY, PARROT_CHAT_KEY } from './constants';

dotenv.config({ path: '.env' });
let generalChatId = '';
let parrotChatId = '';
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
  const findGeneralChatId = await Options.findOne({ where: { key: GENERAL_CHAT_KEY } });
  if (findGeneralChatId) generalChatId = findGeneralChatId.get('value') as string;
  const findParrotChatId = await Options.findOne({ where: { key: PARROT_CHAT_KEY } });
  if (findParrotChatId) parrotChatId = findParrotChatId.get('value') as string;
};

export const updateGeneralChatId = async (newGeneralChatID:string) => {
  const findChatId = await Options.findOne({ where: { key: GENERAL_CHAT_KEY } });

  if (!findChatId) {
    await Options.create({
      key: GENERAL_CHAT_KEY,
      value: newGeneralChatID,
    });
  } else if (findChatId.get('value') !== newGeneralChatID) {
    await Options.update({ value: newGeneralChatID }, { where: { key: GENERAL_CHAT_KEY } });
    generalChatId = newGeneralChatID;
  }
};

export const updateParrotChatId = async (newParrotChatID: string) => {
  const findChatId = await Options.findOne({ where: { key: PARROT_CHAT_KEY } });

  if (!findChatId) {
    await Options.create({
      key: PARROT_CHAT_KEY,
      value: newParrotChatID,
    });
  } else if (findChatId.get('value') !== newParrotChatID) {
    await Options.update({ value: newParrotChatID }, { where: { key: PARROT_CHAT_KEY } });
    parrotChatId = newParrotChatID;
  }
};

export const getGeneralChatId = () => generalChatId;
export const getParrotChatId = () => parrotChatId;
