import { sendRandomBird } from './functions';
import { getFrequency } from './db';

let timeoutKey: any;
const randomiseBird = async () => {
  const frequency = await getFrequency();
  const days = parseInt(frequency || '1');
  const rand = Math.ceil(Math.random() * 24);
  timeoutKey = setTimeout(() => {
    sendRandomBird();
    randomiseBird();
  }, 1000 * 60 * 60 * days * rand);
};

const stopBird = () => {
  clearTimeout(timeoutKey);
}
export default { randomiseBirdAppearance: randomiseBird, stopBird };
