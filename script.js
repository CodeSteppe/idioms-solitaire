// DOM
const graph = document.querySelector('#graph');
const translater = document.querySelector('#translater');
const zoomer = document.querySelector('#zoomer');

// 变量
let currentIdiom;
const data = {
  nodes: [],
  links: []
}

function setGraphSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  graph.setAttribute('width', width);
  graph.setAttribute('height', height);
  graph.setAttribute('viewBox', `${-width / 2},${-height / 2},${width},${height}`);
}

setGraphSize();
window.addEventListener('resize', setGraphSize);

const chart = createChart({
  svgElement: document.querySelector('#graph'),
  handleClickNode: (event, dataItem) => {
    currentIdiom = dataItem.id;
    findNextIdiom();
  }
});

// 成语接龙核心逻辑

// 取随机整数，包含min，不包含max
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// 绘制第一个成语节点
function drawFirstIdiom() {
  currentIdiom = idioms[getRandomInt(0, idioms.length)];
  console.log('first idiom', currentIdiom);
  data.nodes.push({
    id: currentIdiom
  });
  chart.update(data);
}

drawFirstIdiom();

// 寻找以当前成语最后一个字开头的成语
function findNextIdiom() {
  // 当前成语的最后一个字
  const lastWord = currentIdiom[currentIdiom.length - 1];
  // 以lastWord开头的成语
  const matches = idioms.filter(idiom => idiom[0] === lastWord);
  if (matches.length <= 0) {
    alert(`哎呀，找不到以 "${lastWord}" 开头的成语了！`);
    return;
  }

  let match;
  for (const m of matches) {
    if (data.nodes.find(node => node.id === m)) {
      // 如果接龙里已经有这个成语，则跳过
      continue;
    }
    match = m;
  }

  if (!match) {
    alert(`哎呀，以 "${lastWord}" 开头的成语都已经展示了，找不到更多了！`);
    return;
  }

  data.nodes.push({
    id: match
  });
  data.links.push({
    source: currentIdiom,
    target: match
  });
  chart.update(data);
}

// 画布的移动和缩放
let startPoint = { x: 0, y: 0 };
// 画布移动的距离
let translate = { x: 0, y: 0 };
// 画布上一次停止移动时所在的位置
let lastTranslate = { x: 0, y: 0 };
// 画布缩放的比列
let scale = 1;

function handleMouseDown(e) {
  const { clientX, clientY } = e;
  startPoint = {
    x: clientX,
    y: clientY
  }
  graph.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(e) {
  const { clientX, clientY } = e;
  const deltaX = clientX - startPoint.x;
  const deltaY = clientY - startPoint.y;
  translate = {
    x: lastTranslate.x + deltaX,
    y: lastTranslate.y + deltaY,
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
    // 最大缩小倍数为0.1
    scale = 0.1;
  } else {
    // 缩放倍数精确到小数点第二位
    scale = Number(scale.toFixed(2));
  }
  zoomer.style.transform = `scale(${scale})`;
}

graph.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
graph.addEventListener('wheel', handleWheel);