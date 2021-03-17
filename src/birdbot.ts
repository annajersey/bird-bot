import { Client, Message, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import { UserRole } from './constants';
import { DBinit, getGeneralChatId, getParrotChatId } from './db';
import {
  getPrefix,
} from './functions';
import commands from './commands';
import randomiseBirdAppearance from './randomiseBird';

dotenv.config({ path: '.env' });
const client = new Client();

export const getGeneralChannel = () => {
  const generalChatId = getGeneralChatId();
  return client.channels.cache.get(generalChatId) as TextChannel;
};
export const main = () => {
  client.once('ready', async () => {
    //
  });

  client.on('message', async (msg: Message) => {
    const serverID = msg?.guild?.id;
    await DBinit(serverID);
    const generalChannel = getGeneralChannel();
    const parrotChatId = getParrotChatId();
    if (msg.channel.id === parrotChatId) {
      return generalChannel && generalChannel.send(msg.content);
    }

    const prefix = getPrefix(msg.content);
    if (!prefix) return;

    const cleanCommand = msg.content.replace(prefix, '').trim() || 'chirp';
    const command = commands.find((command) => cleanCommand.startsWith(command.key));
    if (!command) return;
    if (command.role === UserRole.Admin && !msg?.member?.hasPermission('ADMINISTRATOR')) return;
    command.execute(msg);
  });

  client.login(process.env.BOTTOKEN);

  randomiseBirdAppearance.randomiseBirdAppearance();
};
main();
