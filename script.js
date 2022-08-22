// variables
let currentIdiom;
let data = {
  nodes: [],
  links: [],
}

// functions
const chart = createChart({
  hanleClickNode: (event, dataItem) => {
    console.log('clicked', dataItem);
    currentIdiom = dataItem;
    findNext();
  }
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function drawFirstIdiom() {
  currentIdiom = idioms[getRandomInt(0, idioms.length)];
  data.nodes.push({
    id: currentIdiom.id,
    pinyin: currentIdiom.pinyin
  });
  chart.update(data);
}


function findNext() {
  console.log('currentIdiom', currentIdiom)
  const matches = idioms.filter(idiom => idiom.id[0] === currentIdiom.id.split('').pop());
  console.log('matches', matches);
  data.nodes.push(...matches);
  data.links.push(...(matches.map(match => ({
    source: currentIdiom.id,
    target: match.id,
  }))));
  chart.update(data);
}

drawFirstIdiom();