// DOM
const graph = document.querySelector('#graph');
const zoomer = document.querySelector('#zoomer');
const translater = document.querySelector('#translater');

// variables
let currentIdiom;
let data = {
  nodes: [],
  links: [],
}

// functions
function setGraphSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  graph.setAttribute('width',width);
  graph.setAttribute('height', height);
  graph.setAttribute('viewBox', `${-width / 2}, ${-height / 2}, ${width}, ${height}`);
}
setGraphSize();
window.addEventListener('resize', setGraphSize);

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
    return
  }

  let match;
  for (const m of matches) {
    if (data.nodes.find(n => n.id === m.id)) {
      // 如果接龙里面已经有这个成语，则跳过
      continue;
    }
    match = m;
  }
  if (!match) {
    alert(`哎呀，以“${lastWord}”开头的成语都已经展示了，找不到更多了`);
    return
  }

  data.nodes.push(match);
  data.links.push({
    source: currentIdiom.id,
    target: match.id,
  });
  chart.update(data);
}

drawFirstIdiom();

/**
 * Graph transform
 */
let startPoint = { x: 0, y: 0 };
let lastTranslate = { x: 0, y: 0 };
let translate = { x: 0, y: 0 };
let scale = 1;

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
  translater.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
}

function handleMouseUp(e) {
  lastTranslate = translate;
  graph.removeEventListener('mousemove', handleMouseMove);
}

function handleWheel(e) {
  const { deltaY } = e;
  const direction = deltaY < 0 ? 1 : -1;
  scale += direction * 0.1;
  if (scale < 0.1) {
    scale = 0.1;
  } else {
    scale = Number(scale.toFixed(2));
  }
  zoomer.style.transform = `scale(${scale})`;
}

graph.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
graph.addEventListener('wheel', handleWheel);