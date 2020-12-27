import Discord, { TextChannel } from 'discord.js';
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const client = new Discord.Client();
const chirps = [
  'ligjërim :flag_al:',
  'чырык :flag_by:',
  'cvrkut :flag_ba:',
  'весел :flag_bg:',
  'cvrkut :flag_hr:',
  'cvrlikání :flag_cz:',
  'pippe :flag_dk:',
  'piepen :flag_nl:',
  'siristama :flag_ee:',
  'visertää :flag_fi:',
  'gazouiller :flag_fr:',
  'tsjilje :flag_nl:',
  'zwitschern :flag_de:',
  'τερέτισμα :flag_gr:',
  'csipog :flag_hu:',
  'Kyrr :flag_is:',
  'chirp :flag_ie:',
  'cinguettio :flag_it:',
  'čiepstēt :flag_lv:',
  'čiauškėti :flag_lt:',
  'весел :flag_mk:',
  'chirp :flag_us:',
  'kvitre :flag_no:',
  'ćwierkanie :flag_pl:',
  'chilro :flag_pt:',
  'ciripit :flag_ro:',
  'чирик-чирик :flag_ru:',
  'cvrlikání :flag_sk:',
  'Cvrkutati :flag_si:',
  'chirrido :flag_es:',
  'kvittra :flag_se:',
  'цвіріньк :flag_ua:',
];
const simpleChirps = ['chirp chirp', 'chirp chirp', 'chirp chirp', 'chirp chirp', 'chirp?', 'chirp?!', 'chi-chirp', 'tweet tweet', 'tweet tweet tweet', 'chichichirp'];

const topics = ['beep beep', 'boop boop'];
const botTalks = ['chirp'];

const mixedChirp = [...chirps, ...simpleChirps];
const birdBotImage = (phrase: string) => `━━━━━━━━━━
　        ${phrase}
'━━┳━━━━━━━
　　╰╮
　　╭━━╮
　　┃▍▍┃
　　╱　　╰╲▁▁
　　▔▏╰╰╰╰╱
　　　╲▁▁▁╱
　　　　┃┃
━━━━┻┻━━━━`;
client.on('message', (msg) => {
  if (msg.content === '!birdbot chirp') {
    msg.reply('chirp chirp!');
    return;
  }
  if (msg.content === '!birdbot chirp random') {
    const ind = Math.floor(Math.random() * chirps.length);
    msg.reply(chirps[ind]);
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
    const ind = Math.floor(Math.random() * topics.length);
    return msg.reply(`*New topic:* ${topics[ind]}`);
  }

  if (msg.content.startsWith('!birdbot')) {
    const ind = Math.floor(Math.random() * mixedChirp.length);
    return msg.reply(mixedChirp[ind]);
  }

  if (msg.channel.id === '790538903601283073') {
    const channel = client.channels.cache.get('768379777416691752') as TextChannel;
    return channel && channel.send(msg.content);
  }
});

client.login(process.env.BOTTOKEN);

setInterval(() => {
  const channel = client.channels.cache.get('768379777416691752') as TextChannel;
  const ind = Math.floor(Math.random() * botTalks.length) ;
  channel && channel.send(birdBotImage(botTalks[ind]));
}, 60000 * 60 * 15);
