import { Message } from 'discord.js';
import {
  helpText, mixedChirps, randomTopics, UserRole,
} from './constants';
import {
  catchTheBird, checkAmount, sendRandomBird, setGeneralChatId,
} from './functions';

type Commands = {[name: string]: {execute: (msg: Message) => void, role: UserRole}}
const commands: Commands = {
  help: {
    execute: (msg: Message) => msg.reply(helpText),
    role: UserRole.User,
  },
  chirp:
    {
      execute: (msg: Message) => {
        const ind = Math.floor(Math.random() * mixedChirps.length);
        return msg.reply(mixedChirps[ind]);
      },
      role: UserRole.User,
    },
  catchbird: {
    execute: (msg: Message) => catchTheBird(msg),
    role: UserRole.User,
  },
  amount: {
    execute: (msg: Message) => checkAmount(msg),
    role: UserRole.User,
  },
  'quote the raven': {
    execute: (msg: Message) => msg.reply('nevermore'),
    role: UserRole.User,
  },
  tickle: {
    execute: (msg: Message) => msg.channel.send(`${msg.author} tickles ${msg.mentions.users.first() || 'an air'}`),
    role: UserRole.User,
  },
  hug: {
    execute: (msg: Message) => msg.channel.send(`${msg.author} hugs ${msg.mentions.users.first() || 'an air'}`),
    role: UserRole.User,
  },
  tell: {
    execute: (msg: Message) => msg.mentions.users.size && msg.channel.send(`${msg.mentions.users.first()} chirp chirp`),
    role: UserRole.User,
  },
  'what is the word': {
    execute: (msg: Message) => msg.reply('bird bird bird :bird:'),
    role: UserRole.User,
  },
  topic: {
    execute: (msg: Message) => {
      const ind = Math.floor(Math.random() * randomTopics.length);
      return msg.reply(`*New topic:* ${randomTopics[ind]}`);
    },
    role: UserRole.User,
  },
  'set general chat id': {
    execute: async (msg: Message) => {
      await setGeneralChatId(msg);
    },
    role: UserRole.Admin,
  },
  'send random bird': {
    execute: async (_: Message) => sendRandomBird(),
    role: UserRole.Admin,
  },
};

export default commands;
