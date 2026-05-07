const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const HN_URL = 'https://news.ycombinator.com';

const runScraper = async () => {
  try {
    console.log('Running Hacker News scraper...');
    const { data } = await axios.get(HN_URL, { timeout: 10000 });
    const $ = cheerio.load(data);

    const stories = [];

    $('.athing').each((i, el) => {
      if (i >= 10) return false;

      const id = $(el).attr('id');
      const titleEl = $(el).find('.titleline > a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || '';

      const subtext = $(`#${id}`).next('.spacer').prev().find('.subtext');
      const points = parseInt(subtext.find('.score').text()) || 0;
      const author = subtext.find('.hnuser').text().trim() || 'unknown';
      const postedAt = subtext.find('.age').attr('title') || subtext.find('.age').text().trim();

      if (title) {
        stories.push({ title, url, points, author, postedAt });
      }
    });

    if (stories.length === 0) {
      console.log('No stories scraped — HN markup may have changed.');
      return;
    }

    await Story.deleteMany({});
    await Story.insertMany(stories);
    console.log(`Scraped and saved ${stories.length} stories.`);
  } catch (err) {
    console.error('Scraper error:', err.message);
  }
};

module.exports = { runScraper };
