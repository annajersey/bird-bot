import { Client, Message, TextChannel } from 'discord.js';
import { birdBotImage, prefixList } from './constants';
import {
  Currency, Options, updateGeneralChatId, updateParrotChatId,
} from './db';
import { getGeneralChannel } from './birdbot';

export const getPrefix = (command: string) => prefixList.find((p: string) => command.startsWith(p));

export const sendRandomBird = async () => {
  const generalChannel = getGeneralChannel();
  const canCatch = await Options.findOne({ where: { key: 'currencyAvailable' } });
  if (!canCatch) {
    await Options.create({
      key: 'currencyAvailable',
      value: 1,
    });
  }
  if (generalChannel) await generalChannel.send(birdBotImage('*A random bird appeared!\n Type* !bb catchbird *to catch the bird*'));
};
export const setGeneralChatId = async (message: Message) => {
  const generalChatID = message.content.split(' ').pop()!;
  try {
    await updateGeneralChatId(generalChatID);
    message.channel.send('General ChatID changed :white_check_mark:');
  } catch (e) {
    message.channel.send('Error');
  }
};
export const setParrotChatId = async (message: Message) => {
  const parrotChatID = message.content.split(' ').pop()!;
  try {
    await updateParrotChatId(parrotChatID);
    message.channel.send('Parrot ChatID changed :white_check_mark:');
  } catch (e) {
    message.channel.send('Error');
  }
};
export const checkAmount = async (message: Message) => {
  const amountData = await Currency.findOne({ where: { userID: message.author.id } });
  if (amountData) {
    const amount = amountData.get('amount') as number;
    return message.reply(`You have ${amount} birds`);
  }
  return message.reply('Nothing`s here');
};
export const catchTheBird = async (message: Message) => {
  try {
    const canCatch = await Options.findOne({ where: { key: 'currencyAvailable' } });
    if (!canCatch) return message.channel.send('Bird flew away...');
    let amountData = await Currency.findOne({ where: { userID: message.author.id } });
    if (amountData) {
      await amountData.increment('amount');
    } else {
      amountData = await Currency.create({
        userID: message.author.id,
        amount: 1,
      });
    }
    await Options.destroy({ where: { key: 'currencyAvailable' } });
    const amount = amountData.get('amount') as number;
    return message.channel.send(`Nice catch, ${message.author}! You now have ${amount} bird${amount > 1 ? 's' : ''}!`);
  } catch (e) {
    console.log(e);
    return message.channel.send('Error');
  }
};

export const randomiseBirdAppearance = () => {
  const rand = Math.ceil(Math.random() * 24);
  setTimeout(() => {
    sendRandomBird();
    randomiseBirdAppearance();
  }, 1000 * 60 * 60 * rand);
};
