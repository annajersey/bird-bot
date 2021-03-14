import Discord, { TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import {
  generalChatId,
  multilanguageChirps,
  randomBotTalks,
  simpleChirps, botPuppetChatId,
} from './constants';
import { Options, Currency } from './db';
import { catchTheBird, sendRandomBird } from './functions';

dotenv.config({ path: '.env' });

const client = new Discord.Client();

const mixedChirp = [...multilanguageChirps, ...simpleChirps];

client.once('ready', async () => {
  await Currency.sync();
  await Options.sync();
});

client.on('message', (msg: Discord.Message) => {
  if (msg.content === '!catchbird') {
    catchTheBird(msg);
  }

  if (msg.content === '!birdbot chirp') {
    msg.reply('chirp chirp!');
    return;
  }
  if (msg.content === '!birdbot chirp random') {
    const ind = Math.floor(Math.random() * simpleChirps.length);
    msg.reply(multilanguageChirps[ind]);
    return;
  }

  if (msg.content.startsWith('!birdbot hug')) {
    if (!msg.mentions.users.size) return;
    return msg.channel.send(`${msg.author} hugs ${msg.mentions.users.first()}`);
  }

  if (msg.content.startsWith('!birdbot tell ')) {
    if (!msg.mentions.users.size) return;
    return msg.channel.send(`${msg.mentions.users.first()} chirp chirp`);
  }

  if (msg.content.startsWith('!birdbot quote the raven')) {
    return msg.reply('nevermore');
  }

  if (msg.content.startsWith('!birdbot what is the word')) {
    return msg.reply('bird bird bird :bird:');
  }

  if (msg.content.startsWith('!birdbot topic')) {
    const ind = Math.floor(Math.random() * randomBotTalks.length);

    return msg.reply(`*New topic:* ${randomBotTalks[ind]}`);
  }

  if (msg.content.startsWith('!birdbot')) {
    const ind = Math.floor(Math.random() * mixedChirp.length);
    return msg.reply(mixedChirp[ind]);
  }

  if (msg.content === '!send random bird' && msg.member && msg.member.hasPermission('ADMINISTRATOR')) {
    sendRandomBird(client);
  }

  if (msg.channel.id === botPuppetChatId) {
    const channel = client.channels.cache.get(generalChatId) as TextChannel;
    return channel && channel.send(msg.content);
  }
});

client.login(process.env.BOTTOKEN);

(function randomiseBirdAppearance() {
  const rand = Math.ceil(Math.random() * 24);
  setTimeout(() => {
    sendRandomBird(client);
    randomiseBirdAppearance();
  }, 1000 * 60 * 60 * rand);
}());
