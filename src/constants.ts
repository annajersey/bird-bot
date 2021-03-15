export const prefixList = ['!birdbot', '!bb', '<@788147829315076106>', '<@!788147829315076106>'];
export const multilanguageChirps = [
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

export const randomTopics = ['Human beings. Wow', 'What`s your favourite person', 'In what country would you prefer to live']; // TODO: save in DB with admin command

export const simpleChirps = ['chirp chirp', 'chirp?', 'chirp?!', 'chi-chirp', 'tweet tweet', 'tweet tweet tweet', 'chichichirp', 'chip'];

export const mixedChirps = [...multilanguageChirps, ...simpleChirps];
/* eslint-disable no-irregular-whitespace */
export const birdBotImage = (phrase: string) => `━━━━━━━━━━━━━━━━━
　        ${phrase}
━━━┳━━━━━━━━━━━━━
　　╰╮
　　╭━━╮
　　┃▍▍┃
　　╱　　╰╲▁▁
　　▔▏╰╰╰╰╱
　　　╲▁▁▁╱
　　　　┃┃
━━━━┻┻━━━━`;
/* eslint-enable no-irregular-whitespace */
export const botParrotChatId = '820390132078870550'; // TODO: save in DB with admin command

export enum UserRole {
  User = 0,
  Admin = 1,
}

export const helpText = `
Bot Prefixes: !birdbot, !bb, or bot mention.

**Commands**: 
!bb chirp: *chirps in random language*
!bb amount: *check how many birds you have* 
!bb hug @user: *hugs @user* 
!bb tell @user: *conveys info*
!bb catchbird: *catches a wild bird when it appears* 
!bb topic: *suggests a topic*
Also: 
!bb quote the raven
!bb what is the word
!bb tickle @user

**Admin Commands**: 
!bb send random bird: *make a wild bird to appear*
!bb set general chat id 12345: *sets id of the main chat*
`
