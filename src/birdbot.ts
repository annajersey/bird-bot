import Discord, { TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import {
  Sequelize,

  DataTypes,
} from 'sequelize';
import {
  generalChatId,
  birdBotImage,
  multilanguageChirps,
  randomBotTalks,
  simpleChirps, botPuppetChatId,
} from './constants';
import { Options, Currency } from './db';

dotenv.config({ path: '.env' });

const client = new Discord.Client();

const mixedChirp = [...multilanguageChirps, ...simpleChirps];

client.once('ready', async () => {
  await Currency.sync();
  await Options.sync();
});

client.on('message', async (msg: Discord.Message) => {
  if (msg.content === '!catchbird') {
    try {
      const canCatch = await Options.findOne({ where: { key: 'currencyAvailable' } });
      if (!canCatch) return msg.channel.send('Bird flew away...');
      let amountData = await Currency.findOne({ where: { userID: msg.author.id } });
      if (amountData) {
        await amountData.increment('amount');
      } else {
        amountData = await Currency.create({
          userID: msg.author.id,
          amount: 1,
        });
      }
      await Options.destroy({ where: { key: 'currencyAvailable' } });
      const amount = amountData.get('amount') as number;
      return msg.channel.send(`Nice catch, ${msg.author}! You now have ${amount} bird${amount > 1 ? 's' : ''}!`);
    } catch (e) {
      console.log(e);
      return msg.channel.send('Error');
    }
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

  if (msg.channel.id === botPuppetChatId) {
    const channel = client.channels.cache.get(generalChatId) as TextChannel;
    return channel && channel.send(msg.content);
  }
});

client.login(process.env.BOTTOKEN);

setInterval(async () => {
  const channel = client.channels.cache.get(generalChatId) as TextChannel;
  const canCatch = await Options.findOne({ where: { key: 'currencyAvailable' } });
  if (!canCatch) {
    await Options.create({
      key: 'currencyAvailable',
      value: 1,
    });
  }
  if (channel) channel.send(birdBotImage('*A wild bird appeared!\n Type* !catchbird *to catch the bird*'));
}, 1000 * 60 * 10 * 30);
