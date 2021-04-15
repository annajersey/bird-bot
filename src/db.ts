import { DataTypes, Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import {
  CURRENCY_AVAILABLE_KEY, FREQUENCY_CHAT_KEY, GENERAL_CHAT_KEY, PARROT_CHAT_KEY,
} from './constants';

dotenv.config({ path: '.env' });

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
  },
  value: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },
  serverID: {
    type: DataTypes.STRING,
    defaultValue: 0,
  },
});

export const DBinit = async () => {
  await Currency.sync();
  await Options.sync();
};

export const updateGeneralChatId = async (newGeneralChatID:string, serverID: string) => {
  const findChatId = await Options.findOne({ where: { key: GENERAL_CHAT_KEY, serverID } });
  if (!findChatId) {
    await Options.create({
      key: GENERAL_CHAT_KEY,
      value: newGeneralChatID,
      serverID,
    });
  } else if (findChatId.get('value') !== newGeneralChatID) {
    await Options.update({ value: newGeneralChatID },
      { where: { key: GENERAL_CHAT_KEY, serverID } });
  }
};

export const getFrequency = async (serverID: string) => {
  try {
    const frequencyData = await Options.findOne({ where: { key: FREQUENCY_CHAT_KEY, serverID } });
    if (frequencyData) return frequencyData.get('value') as string;
  } catch (e) {
    console.log(e);
  }
};

export const updateRandomBirdFrequency = async (newFrequency: string, serverID: string) => {
  const frequencyData = await Options.findOne({ where: { key: FREQUENCY_CHAT_KEY, serverID } });
  if (!frequencyData) {
    await Options.create({
      key: FREQUENCY_CHAT_KEY,
      value: newFrequency,
      serverID,
    });
  } else if (frequencyData.get('value') !== newFrequency) {
    await Options.update({ value: newFrequency }, { where: { key: FREQUENCY_CHAT_KEY, serverID } });
  }
};

export const updateParrotChatId = async (newParrotChatID: string, serverID: string) => {
  const findChatId = await Options.findOne({ where: { key: PARROT_CHAT_KEY, serverID } });

  if (!findChatId) {
    await Options.create({
      key: PARROT_CHAT_KEY,
      value: newParrotChatID,
      serverID,
    });
  } else if (findChatId.get('value') !== newParrotChatID) {
    await Options.update({ value: newParrotChatID }, { where: { key: PARROT_CHAT_KEY, serverID } });
  }
};
export const setCurrencyAvailable = async (currencyAvailableValue: number, serverID: string) => {
  await Options.update(
    { value: currencyAvailableValue },
    { where: { key: CURRENCY_AVAILABLE_KEY, serverID } },
  );
};

export const getGeneralChatId = async (serverID: string) => {
  try {
    const findGeneralChatId = await Options.findOne({ where: { key: GENERAL_CHAT_KEY, serverID } });
    return findGeneralChatId?.get('value') as string;
  } catch (e) {
    console.log(e);
  }
};
export const getParrotChatId = async (serverID: string) => {
  try {
    const findParrotChatId = await Options.findOne({ where: { key: PARROT_CHAT_KEY, serverID } });
    return findParrotChatId?.get('value') as string;
  } catch (e) {
    console.log(e);
  }
};

export const getCurrencyAvailable = async (serverID: string) => {
  const findCurrencyAvailable = await Options.findOne(
    { where: { key: CURRENCY_AVAILABLE_KEY, serverID } },
  );
  return !!parseInt(findCurrencyAvailable?.get('value') as string);
};
