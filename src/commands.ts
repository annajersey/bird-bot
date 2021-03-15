import { Message } from 'discord.js';
import {
  helpText, mixedChirps, randomTopics, UserRole,
} from './constants';
import {
  catchTheBird, checkAmount, sendRandomBird, setGeneralChatId, setParrotChatId,
} from './functions';

type Commands = Array< {key: string, execute: (msg: Message) => void, role: UserRole}>
const commands: Commands = [
  {
    key: 'help',
    execute: (msg: Message) => msg.reply(helpText),
    role: UserRole.User,
  },

  {
    key: 'chirp',
    execute: (msg: Message) => {
      const ind = Math.floor(Math.random() * mixedChirps.length);
      return msg.reply(mixedChirps[ind]);
    },
    role: UserRole.User,
  },
  {
    key: 'catchbird',
    execute: (msg: Message) => catchTheBird(msg),
    role: UserRole.User,
  },
  {
    key: 'amount',
    execute: (msg: Message) => checkAmount(msg),
    role: UserRole.User,
  },
  {
    key: 'quote the raven',
    execute: (msg: Message) => msg.reply('nevermore'),
    role: UserRole.User,
  },
  {
    key: 'tickle',
    execute: (msg: Message) => msg.channel.send(`${msg.author} tickles ${msg.mentions.users.first() || 'an air'}`),
    role: UserRole.User,
  },
  {
    key: 'hug',
    execute: (msg: Message) => msg.channel.send(`${msg.author} hugs ${msg.mentions.users.first() || 'an air'}`),
    role: UserRole.User,
  },
  {
    key: 'tell',
    execute: (msg: Message) => msg.mentions.users.size && msg.channel.send(`${msg.mentions.users.first()} chirp chirp`),
    role: UserRole.User,
  },
  {
    key: 'what is the word',
    execute: (msg: Message) => msg.reply('bird bird bird :bird:'),
    role: UserRole.User,
  },
  {
    key: 'topic',
    execute: (msg: Message) => {
      const ind = Math.floor(Math.random() * randomTopics.length);
      return msg.reply(`*New topic:* ${randomTopics[ind]}`);
    },
    role: UserRole.User,
  },
  {
    key: 'set general chat id',
    execute: async (msg: Message) => {
      await setGeneralChatId(msg);
    },
    role: UserRole.Admin,
  },
  {
    key: 'set parrot chat id',
    execute: async (msg: Message) => {
      await setParrotChatId(msg);
    },
    role: UserRole.Admin,
  },
  {
    key: 'send random bird',
    execute: async (_: Message) => sendRandomBird(),
    role: UserRole.Admin,
  },
];

export default commands;
