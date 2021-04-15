import { Message } from 'discord.js';
import { sendRandomBird } from './functions';
import { getFrequency } from './db';

const timeoutKey: {[n: string]: any} = {}
const randomiseBird = async (message: Message) => {
  const serverID = message?.guild?.id;
  if (!serverID) return;
  const frequency = await getFrequency(serverID);
  const days = parseInt(frequency || '1');
  const rand = Math.ceil(Math.random() * 24);
  try {
    timeoutKey[serverID] = setTimeout(() => {
      sendRandomBird(message);
      randomiseBird(message);
    }, 1000 * 60 * 60 * days * rand);
  } catch (e) {
    console.log('timeout error', e);
  }
};

const stopBird = (serverID: string) => {
  try {
    if (timeoutKey?.[serverID]) clearTimeout(timeoutKey[serverID]);
  } catch (e) {
    console.log(e);
  }
};
export default { randomiseBirdAppearance: randomiseBird, stopBird };
