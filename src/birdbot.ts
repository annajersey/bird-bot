import Discord, { Message, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import {
  multilanguageChirps,
  randomBotTalks,
  simpleChirps,
  mixedChirps,
  botParrotChatId,
} from './constants';
import { DBinit, getGeneralChatId } from './db';
import {
  catchTheBird,
  getPrefix,
  randomiseBirdAppearance,
  sendRandomBird,
  setGeneralChatId,
} from './functions';

dotenv.config({ path: '.env' });

const client = new Discord.Client();

client.once('ready', async () => {
  await DBinit();
});

client.on('message', (msg: Discord.Message) => {
  const handleCommand = (command: string, handle: () => void) => {
    const prefix = getPrefix(msg.content);
    if (!prefix) return;
    const cleanCommand = msg.content.replace(prefix, '').trim();
    if (!cleanCommand) {
      const ind = Math.floor(Math.random() * mixedChirps.length);
      return msg.reply(mixedChirps[ind]);
    }

    if (cleanCommand.startsWith(command)) {
      return handle();
    }
  };

  const handleAdminCommand = (command: string, handle: () => void) => {
    const prefix = getPrefix(msg.content);
    if (!prefix) return;

    const cleanCommand = msg.content.replace(prefix, '').trim();
    if (!msg.member || !msg.member.hasPermission('ADMINISTRATOR')) return;
    if (msg.content.includes(command)) { return handle(); }
  };

  if (msg.content === '!catchbird') return catchTheBird(msg);

  handleCommand('chirp', () => {
    const ind = Math.floor(Math.random() * multilanguageChirps.length);
    return msg.reply(multilanguageChirps[ind]);
  });
  handleCommand('quote the raven', () => msg.reply('nevermore'));
  handleCommand('hug', () => msg.channel.send(`${msg.author} hugs ${msg.mentions.users.first() || 'an air'}`));
  handleCommand('tell', () => { if (msg.mentions.users.size) msg.channel.send(`${msg.mentions.users.first()} chirp chirp`); });
  handleCommand('what is the word', () => msg.reply('bird bird bird :bird:'));
  handleCommand('topic', () => {
    const ind = Math.floor(Math.random() * randomBotTalks.length);
    return msg.reply(`*New topic:* ${randomBotTalks[ind]}`);
  });

  handleAdminCommand('send random bird', () => sendRandomBird(client));
  handleAdminCommand('set general chat id', async () => {
    await setGeneralChatId(msg);
  });

  if (msg.channel.id === botParrotChatId) {
    const generalChatId = getGeneralChatId();
    const channel = client.channels.cache.get(generalChatId) as TextChannel;
    return channel && channel.send(msg.content);
  }
});

client.login(process.env.BOTTOKEN);

randomiseBirdAppearance(client);
