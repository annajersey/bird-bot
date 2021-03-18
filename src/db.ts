import { DataTypes, Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { FREQUENCY_CHAT_KEY, GENERAL_CHAT_KEY, PARROT_CHAT_KEY } from './constants';

dotenv.config({ path: '.env' });
let generalChatId = '';
let parrotChatId = '';
let serverID = '';
let frequency: string;
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
  const findGeneralChatId = await Options.findOne({ where: { key: GENERAL_CHAT_KEY, serverID } });
  if (findGeneralChatId) generalChatId = findGeneralChatId.get('value') as string;
  const findParrotChatId = await Options.findOne({ where: { key: PARROT_CHAT_KEY, serverID } });
  if (findParrotChatId) parrotChatId = findParrotChatId.get('value') as string;
};

export const updateGeneralChatId = async (newGeneralChatID:string) => {
  const findChatId = await Options.findOne({ where: { key: GENERAL_CHAT_KEY, serverID } });
  console.log(findChatId, serverID);
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
    const frequencyData = await Options.findOne({ where: { key: FREQUENCY_CHAT_KEY, serverID } });
    if (frequencyData) frequency = frequencyData.get('value') as string;

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

export const getGeneralChatId = () => generalChatId;
export const getParrotChatId = () => parrotChatId;
export const getServerId = () => serverID;
