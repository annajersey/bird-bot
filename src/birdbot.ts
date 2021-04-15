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
export const getClient = () => client;
const getGeneralChannel = async (serverID: string) => {
  const generalChatId = await getGeneralChatId(serverID);
  return generalChatId && client.channels.cache.get(generalChatId) as TextChannel;
};
export const main = () => {
  client.once('ready', async () => {
    //
  });

  client.on('message', async (msg: Message) => {
    const serverID = msg?.guild?.id;
    if (!serverID) return;
    await DBinit();
    const generalChannel = await getGeneralChannel(serverID);
    const parrotChatId = await getParrotChatId(serverID);
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
};
main();
