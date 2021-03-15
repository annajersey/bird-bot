import Discord, { Message, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import {
  botParrotChatId, UserRole,
} from './constants';
import { DBinit, getGeneralChatId } from './db';
import {
  getPrefix,
  randomiseBirdAppearance,
} from './functions';
import commands from './commands';

dotenv.config({ path: '.env' });

const client = new Discord.Client();

client.once('ready', async () => {
  await DBinit();
});

export const getGeneralChannel = () => {
  const generalChatId = getGeneralChatId();
  return client.channels.cache.get(generalChatId) as TextChannel;
};

client.on('message', (msg: Discord.Message) => {
  const generalChannel = getGeneralChannel();
  if (msg.channel.id === botParrotChatId) {
    return generalChannel && generalChannel.send(msg.content);
  }

  const prefix = getPrefix(msg.content);
  if (!prefix || msg.author.bot) return;

  const cleanCommand = msg.content.replace(prefix, '').trim() || 'chirp';

  const command = commands[cleanCommand];
  if (command.role === UserRole.Admin && !msg?.member?.hasPermission('ADMINISTRATOR')) return;
  command.execute(msg);
});

client.login(process.env.BOTTOKEN);

randomiseBirdAppearance();
