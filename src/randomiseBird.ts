import { sendRandomBird } from './functions';

const randomiseBird = () => {
  const rand = Math.ceil(Math.random() * 24);
  setTimeout(() => {
    sendRandomBird();
    randomiseBird();
  }, 1000 * 60 * 60 * 2 * rand);
};
export default { randomiseBirdAppearance: randomiseBird };
