const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio'); 
require('colors');

const headers = require('./data/headers');
const generateData = require('./data/data');

const filePath = path.join(__dirname, 'links', 'movies.json');

function loadLinks() {
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonData);
}

async function checkLink(testURL) {
  try {
    const data = generateData(testURL);
    const response = await axios.post('https://uqload.ws/checkfiles.html', data, { headers });
    const html = response.data;
    const $ = cheerio.load(html);

    const message = $('p.text-center').text().trim();

    if (message.includes('not found')) {
      console.log(`[-] Invalid ${testURL}`.red);
    } else if (message.includes('found')) {
      console.log(`[+] Valid ${testURL}`.green); 
    } else {
      console.log(`Unknown result: ${testURL}`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function fetchAllLinks() {
  const linksData = loadLinks();
  
  for (const item of linksData) {
    for (const link of item.links) {
      await checkLink(link); 
    }
  }
}

fetchAllLinks();
