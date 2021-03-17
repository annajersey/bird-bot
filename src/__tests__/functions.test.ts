import { MockMessage, MockTextChannel, MockGuild } from 'jest-discordjs-mocks';
import { checkAmount } from '../functions';

jest.mock('../randomiseBird', () => ({ randomiseBirdAppearance: jest.fn() }));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SequelizeMock = require('sequelize-mock');

const DBConnectionMock = new SequelizeMock();

const UserMock = DBConnectionMock.define('currency', {
  userID: '123',
  amount: '7',
});

test('checkAmount', async () => {
  const message = new MockMessage();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  message.author = { id: '123' };
  message.reply = jest.fn();
  await checkAmount(message);
  await expect(message.reply).toHaveBeenCalled();
});
