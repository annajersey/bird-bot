import { Client, Message, TextChannel } from 'discord.js';
import { birdBotImage, generalChatId } from './constants';
import { Currency, Options } from './db';

export const sendRandomBird = async (client: Client) => {
  const channel = client.channels.cache.get(generalChatId) as TextChannel;
  const canCatch = await Options.findOne({ where: { key: 'currencyAvailable' } });
  if (!canCatch) {
    await Options.create({
      key: 'currencyAvailable',
      value: 1,
    });
  }
  if (channel) channel.send(birdBotImage('*A random bird appeared!\n Type* !catchbird *to catch the bird*'));
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
