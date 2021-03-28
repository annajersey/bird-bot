import { DataTypes, Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import {
  CURRENCY_AVAILABLE_KEY, FREQUENCY_CHAT_KEY, GENERAL_CHAT_KEY, PARROT_CHAT_KEY,
} from './constants';

dotenv.config({ path: '.env' });
let generalChatId: string;
let parrotChatId: string;
let serverID: string;
let frequency: string;
let currencyAvailable: boolean;

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

export const DBinit = async (guildID?: string) => {
  if (!guildID || guildID === serverID) return;
  serverID = guildID;
  await Currency.sync();
  await Options.sync();
};

export const updateGeneralChatId = async (newGeneralChatID:string) => {
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
    generalChatId = newGeneralChatID;
  }
};

export const getFrequency = async () => {
  if (!frequency) {
    try {
      const frequencyData = await Options.findOne({ where: { key: FREQUENCY_CHAT_KEY, serverID } });
      if (frequencyData) frequency = frequencyData.get('value') as string;
    } catch (e) {
      console.log(e);
    }
    return frequency;
  }
};

export const updateRandomBirdFrequency = async (newFrequency: string) => {
  const frequencyData = await Options.findOne({ where: { key: FREQUENCY_CHAT_KEY, serverID } });
  if (!frequencyData) {
    await Options.create({
      key: FREQUENCY_CHAT_KEY,
      value: newFrequency,
      serverID,
    });
  } else if (frequencyData.get('value') !== newFrequency) {
    await Options.update({ value: newFrequency }, { where: { key: FREQUENCY_CHAT_KEY, serverID } });
    frequency = newFrequency;
  }
};

export const updateParrotChatId = async (newParrotChatID: string) => {
  const findChatId = await Options.findOne({ where: { key: PARROT_CHAT_KEY, serverID } });

  if (!findChatId) {
    await Options.create({
      key: PARROT_CHAT_KEY,
      value: newParrotChatID,
      serverID,
    });
  } else if (findChatId.get('value') !== newParrotChatID) {
    await Options.update({ value: newParrotChatID }, { where: { key: PARROT_CHAT_KEY, serverID } });
    parrotChatId = newParrotChatID;
  }
};
export const setCurrencyAvailable = async (currencyAvailableValue: number) => {
  await Options.update(
    { value: currencyAvailableValue },
    { where: { key: CURRENCY_AVAILABLE_KEY, serverID } },
  );
  currencyAvailable = !!currencyAvailableValue;
};

export const getGeneralChatId = async () => {
  if (!serverID) return;
  if (generalChatId) return generalChatId;
  try {
    const findGeneralChatId = await Options.findOne({ where: { key: GENERAL_CHAT_KEY, serverID } });
    if (findGeneralChatId) generalChatId = findGeneralChatId.get('value') as string;
  } catch (e) {
    console.log(e);
  }
  return generalChatId;
};
export const getParrotChatId = async () => {
  if (!serverID) return;
  if (parrotChatId) return parrotChatId;
  try {
    const findParrotChatId = await Options.findOne({ where: { key: PARROT_CHAT_KEY, serverID } });
    if (findParrotChatId) parrotChatId = findParrotChatId.get('value') as string;
  } catch (e) {
    console.log(e);
  }
  return parrotChatId;
};

export const getCurrencyAvailable = async () => {
  if (!serverID) return;
  if (currencyAvailable !== undefined) return currencyAvailable;
  const findCurrencyAvailable = await Options.findOne(
    { where: { key: CURRENCY_AVAILABLE_KEY, serverID } },
  );
  if (findCurrencyAvailable) currencyAvailable = !!findCurrencyAvailable.get('value');
  return currencyAvailable;
};

export const getServerId = () => serverID;
