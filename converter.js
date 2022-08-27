const fs = require('fs');
const path = require('path');
const raw = require('./idiom.json');

function convertRawJsonToChartData() {
  const data = raw.map(item => item.word);
  fs.writeFileSync(path.join(__dirname, './data.json'), JSON.stringify(data));
}

convertRawJsonToChartData();