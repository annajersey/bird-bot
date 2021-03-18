import { sendRandomBird } from './functions';
import { getFrequency } from "./db";

const randomiseBird = async () => {
  const frequency = await getFrequency();
  const days = parseInt(frequency || '1');
  const rand = Math.ceil(Math.random() * 24);
  setTimeout(() => {
    sendRandomBird();
    randomiseBird();
  }, 1000 * 60 * 60 * days * rand);
};
export default { randomiseBirdAppearance: randomiseBird };
