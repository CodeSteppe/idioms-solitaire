// DOM
const graph = document.querySelector('#graph');
const transformer = document.querySelector('#transformer');

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
  const lastWord = currentIdiom.id.split('').pop();
  const matches = idioms.filter(idiom => idiom.id[0] === lastWord);
  if (matches.length <= 0) {
    alert(`哎呀，找不到以“${lastWord}”开头的成语了`);
  }
  const match = matches[getRandomInt(0, matches.length)];
  if (data.nodes.find(node => node.id === match.id)) return;
  data.nodes.push(match);
  data.links.push({
    source: currentIdiom.id,
    target: match.id,
  });
  chart.update(data);
}

drawFirstIdiom();

// handle graph drag move
let startPoint = { x: 0, y: 0 };
let lastTranslate = { x: 0, y: 0 };
let translate = { x: 0, y: 0 };

function handleMouseDown(e) {
  const { clientX, clientY } = e;
  startPoint = {
    x: clientX,
    y: clientY,
  };
  graph.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(e) {
  const { clientX, clientY } = e;
  const deltaX = clientX - startPoint.x;
  const deltaY = clientY - startPoint.y;
  translate = {
    x: lastTranslate.x + deltaX,
    y: lastTranslate.y + deltaY
  };
  transformer.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
}

function handleMouseUp(e) {
  lastTranslate = translate;
  graph.removeEventListener('mousemove', handleMouseMove);
}

graph.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);