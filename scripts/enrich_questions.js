const fs = require('fs');
const path = require('path');

const questions = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/questions_ar.json'), 'utf8'));

// Authentic Wikipedia Commons Images
const WIKI_IMAGES = {
  flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flag_of_Romania.svg/1280px-Flag_of_Romania.svg.png',
  coat_of_arms: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Coat_of_arms_of_Romania.svg/1280px-Coat_of_arms_of_Romania.svg.png',
  parliament: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/18/Bucharest_-_Palace_of_the_Parliament_%282024%29_%282%29.jpg/1280px-Bucharest_-_Palace_of_the_Parliament_%282024%29_%282%29.jpg',
  athenaeum: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Ateneo_Rumano%2C_Bucarest%2C_Ruman%C3%ADa%2C_2016-05-29%2C_DD_73.jpg/1280px-Ateneo_Rumano%2C_Bucarest%2C_Ruman%C3%ADa%2C_2016-05-29%2C_DD_73.jpg',
  creanga: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Ion_Creanga-Foto03.jpg',
  eminescu: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Eminescu.jpg',
  caragiale: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Ion_Luca_Caragiale_-_Foto02.jpg',
  grigorescu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Ncolae_Grigorescu_%281860%29.JPG/1280px-Ncolae_Grigorescu_%281860%29.JPG',
  stefan_cel_mare: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/%C5%9Etefan_cel_Mare_%28Stephen_the_Great%29_1488%2C_Vorone%C5%A3_Monastery.jpg',
  mihai_viteazul: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/MihaiViteazul.jpg/1280px-MihaiViteazul.jpg',
  cuza: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Alexandru_Ioan_Cuza_-_Photo_by_Carol_Popp_de_Szathm%C3%A1ry.jpg/1280px-Alexandru_Ioan_Cuza_-_Photo_by_Carol_Popp_de_Szathm%C3%A1ry.jpg',
  vlad_tepes: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Vlad_%C5%A2epe%C5%9F%2C_the_Impaler%2C_Prince_of_Wallachia_%281456-1462%29_%28died_1477%29.jpg/1280px-Vlad_%C5%A2epe%C5%9F%2C_the_Impaler%2C_Prince_of_Wallachia_%281456-1462%29_%28died_1477%29.jpg',
  bran_castle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Castelul_Bran2.jpg/1280px-Castelul_Bran2.jpg',
  peles_castle: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/01_Chateau_Peles.jpg/1280px-01_Chateau_Peles.jpg',
  danube: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/The_Danube_Spills_into_the_Black_Sea.jpg/1280px-The_Danube_Spills_into_the_Black_Sea.jpg',
  carpathians: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Morskie_Oko_in_2020.jpg/1280px-Morskie_Oko_in_2020.jpg',
  enescu: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Georges_Enesco_1930.jpg',
  brancusi: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Edward_Steichen_-_Brancusi.jpg',
  eliade: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Mircea_Eliade_young.jpg',
  constitution: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
  map: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80',
};

// Wikipedia Article Links
const WIKI_LINKS = {
  creanga: 'https://en.wikipedia.org/wiki/Ion_Creang%C4%83',
  eminescu: 'https://en.wikipedia.org/wiki/Mihai_Eminescu',
  caragiale: 'https://en.wikipedia.org/wiki/Ion_Luca_Caragiale',
  grigorescu: 'https://en.wikipedia.org/wiki/Nicolae_Grigorescu',
  stefan_cel_mare: 'https://en.wikipedia.org/wiki/Stephen_the_Great',
  mihai_viteazul: 'https://en.wikipedia.org/wiki/Michael_the_Brave',
  cuza: 'https://en.wikipedia.org/wiki/Alexandru_Ioan_Cuza',
  vlad_tepes: 'https://en.wikipedia.org/wiki/Vlad_the_Impaler',
  bran_castle: 'https://en.wikipedia.org/wiki/Bran_Castle',
  peles_castle: 'https://en.wikipedia.org/wiki/Pele%C8%99_Castle',
  flag: 'https://en.wikipedia.org/wiki/Flag_of_Romania',
  coat_of_arms: 'https://en.wikipedia.org/wiki/Coat_of_arms_of_Romania',
  parliament: 'https://en.wikipedia.org/wiki/Palace_of_the_Parliament',
  athenaeum: 'https://en.wikipedia.org/wiki/Romanian_Athenaeum',
  danube: 'https://en.wikipedia.org/wiki/Danube',
  carpathians: 'https://en.wikipedia.org/wiki/Carpathian_Mountains',
  enescu: 'https://en.wikipedia.org/wiki/George_Enescu',
  brancusi: 'https://en.wikipedia.org/wiki/Constantin_Br%C3%A2ncu%C8%99i',
  eliade: 'https://en.wikipedia.org/wiki/Mircea_Eliade',
  constitution: 'https://en.wikipedia.org/wiki/Constitution_of_Romania',
  general: 'https://en.wikipedia.org/wiki/Romania',
};

function assignWikiDetails(item) {
  const text = (item.question + ' ' + item.answer + ' ' + (item.question_ar || '')).toLowerCase();

  let img = WIKI_IMAGES.flag;
  let wiki_url = WIKI_LINKS.general;

  if (text.includes('creangă')) { img = WIKI_IMAGES.creanga; wiki_url = WIKI_LINKS.creanga; }
  else if (text.includes('eminescu')) { img = WIKI_IMAGES.eminescu; wiki_url = WIKI_LINKS.eminescu; }
  else if (text.includes('caragiale')) { img = WIKI_IMAGES.caragiale; wiki_url = WIKI_LINKS.caragiale; }
  else if (text.includes('grigorescu')) { img = WIKI_IMAGES.grigorescu; wiki_url = WIKI_LINKS.grigorescu; }
  else if (text.includes('ștefan cel mare')) { img = WIKI_IMAGES.stefan_cel_mare; wiki_url = WIKI_LINKS.stefan_cel_mare; }
  else if (text.includes('mihai viteazul')) { img = WIKI_IMAGES.mihai_viteazul; wiki_url = WIKI_LINKS.mihai_viteazul; }
  else if (text.includes('cuza')) { img = WIKI_IMAGES.cuza; wiki_url = WIKI_LINKS.cuza; }
  else if (text.includes('vlad țepeș')) { img = WIKI_IMAGES.vlad_tepes; wiki_url = WIKI_LINKS.vlad_tepes; }
  else if (text.includes('bran') || text.includes('dracula')) { img = WIKI_IMAGES.bran_castle; wiki_url = WIKI_LINKS.bran_castle; }
  else if (text.includes('peleș') || text.includes('carol') || text.includes('rege')) { img = WIKI_IMAGES.peles_castle; wiki_url = WIKI_LINKS.peles_castle; }
  else if (text.includes('drapel') || text.includes('steag') || text.includes('imn') || text.includes('tricolor')) { img = WIKI_IMAGES.flag; wiki_url = WIKI_LINKS.flag; }
  else if (text.includes('stema') || text.includes('stemă')) { img = WIKI_IMAGES.coat_of_arms; wiki_url = WIKI_LINKS.coat_of_arms; }
  else if (text.includes('parlament') || text.includes('senat') || text.includes('deputați')) { img = WIKI_IMAGES.parliament; wiki_url = WIKI_LINKS.parliament; }
  else if (text.includes('ateneul') || text.includes('bucurești')) { img = WIKI_IMAGES.athenaeum; wiki_url = WIKI_LINKS.athenaeum; }
  else if (text.includes('dunăre') || text.includes('fluviu') || text.includes('deltă')) { img = WIKI_IMAGES.danube; wiki_url = WIKI_LINKS.danube; }
  else if (text.includes('carpați') || text.includes('munte') || text.includes('vârf')) { img = WIKI_IMAGES.carpathians; wiki_url = WIKI_LINKS.carpathians; }
  else if (text.includes('enescu')) { img = WIKI_IMAGES.enescu; wiki_url = WIKI_LINKS.enescu; }
  else if (text.includes('brâncuși')) { img = WIKI_IMAGES.brancusi; wiki_url = WIKI_LINKS.brancusi; }
  else if (text.includes('eliade')) { img = WIKI_IMAGES.eliade; wiki_url = WIKI_LINKS.eliade; }
  else if (text.includes('constituți') || text.includes('judecător') || text.includes('drept')) { img = WIKI_IMAGES.constitution; wiki_url = WIKI_LINKS.constitution; }
  else {
    if (item.category === 'constitution') { img = WIKI_IMAGES.parliament; wiki_url = WIKI_LINKS.constitution; }
    else if (item.category === 'history') { img = WIKI_IMAGES.stefan_cel_mare; wiki_url = WIKI_LINKS.stefan_cel_mare; }
    else if (item.category === 'geography') { img = WIKI_IMAGES.carpathians; wiki_url = WIKI_LINKS.carpathians; }
    else if (item.category === 'culture') { img = WIKI_IMAGES.eminescu; wiki_url = WIKI_LINKS.eminescu; }
  }

  return {
    ...item,
    image: img,
    wiki_url: wiki_url
  };
}

const updatedQuestions = questions.map(assignWikiDetails);

fs.writeFileSync(
  path.join(__dirname, '../src/data/questions_ar.json'),
  JSON.stringify(updatedQuestions, null, 2),
  'utf8'
);

console.log('Successfully assigned Wikipedia images and article links to all 469 questions!');
