import { Client, Message, TextChannel } from 'discord.js';
import { birdBotImage, prefixList } from './constants';
import {
  Currency,
  Options,
  updateGeneralChatId,
  updateParrotChatId,
  updateRandomBirdFrequency,
  getCurrencyAvailable,
  setCurrencyAvailable, getGeneralChatId,
} from './db';
import { getClient } from './birdbot';
import randomiseBirdAppearance from './randomiseBird';

export const getPrefix = (command: string) => prefixList.find((p: string) => command.startsWith(p));

export const sendRandomBird = async (message: Message) => {
  const serverID = message?.guild?.id;
  if (!serverID) return;
  const canCatch = await getCurrencyAvailable(serverID);

  const generalChatId = await getGeneralChatId(serverID);

  if (!canCatch) {
    await setCurrencyAvailable(1, serverID);
  }
  const client = getClient();

  const channel = generalChatId && client.channels.cache.get(generalChatId) as TextChannel;
  if (channel) {
    channel.send(
      birdBotImage('*A random bird appeared!\n Type* !bb catchbird *to catch the bird*'),
    );
  }
};
export const setGeneralChatId = async (message: Message) => {
  const serverID = message?.guild?.id;
  if (!serverID) return;
  const generalChatID = message.content.split(' ').pop()!;
  try {
    await updateGeneralChatId(generalChatID, serverID);
    message.channel.send('General ChatID changed :white_check_mark:');
  } catch (e) {
    message.channel.send('Error');
  }
};
export const sendRandomBirdFrequency = async (message: Message) => {
  try {
    const frequency = message.content.split(' ').pop()!;
    const serverID = message?.guild?.id;
    if (!serverID) return;
    await updateRandomBirdFrequency(frequency, serverID);
    randomiseBirdAppearance.stopBird(serverID);
    await randomiseBirdAppearance.randomiseBirdAppearance(message);
    message.channel.send(`Now random bird will appear once in ${frequency} days :white_check_mark:`);
  } catch (e) {
    message.channel.send(e);
  }
};
export const setParrotChatId = async (message: Message) => {
  const parrotChatID = message.content.split(' ').pop()!;
  const serverID = message?.guild?.id;
  if (!serverID) return;
  try {
    await updateParrotChatId(parrotChatID, serverID);
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
  const serverID = message?.guild?.id;
  if (!serverID) return;
  try {
    const canCatch = await getCurrencyAvailable(serverID);
    if (!canCatch) return message.channel.send('Bird flew away...Wait till a new one will appear');
    let amountData = await Currency.findOne({ where: { userID: message.author.id } });
    if (amountData) {
      await amountData.increment('amount');
    } else {
      amountData = await Currency.create({
        userID: message.author.id,
        amount: 1,
      });
    }
    await setCurrencyAvailable(0, serverID);
    const amount = amountData.get('amount') as number;
    return message.channel.send(`Nice catch, ${message.author}! You now have ${amount} bird${amount > 1 ? 's' : ''}!`);
  } catch (e) {
    console.log(e);
    return message.channel.send('Error');
  }
};
