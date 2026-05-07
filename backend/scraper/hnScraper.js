const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const HN_URL = 'https://news.ycombinator.com';
const SCRAPE_LIMIT = 10;

const runScraper = async () => {
  try {
    console.log('Running Hacker News scraper...');
    const { data } = await axios.get(HN_URL, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 HN-Scraper/1.0' },
    });

    const $ = cheerio.load(data);
    const stories = [];

    $('.athing').each((i, el) => {
      if (i >= SCRAPE_LIMIT) return false;

      const id = $(el).attr('id');
      const titleEl = $(el).find('.titleline > a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || '';

      const subRow = $(`tr[id="${id}"]`).next('tr');
      const points = parseInt(subRow.find('.score').text()) || 0;
      const author = subRow.find('.hnuser').text().trim() || 'unknown';
      const ageEl = subRow.find('.age');
      const postedAt = ageEl.attr('title') || ageEl.text().trim() || '';

      if (title) stories.push({ title, url, points, author, postedAt });
    });

    if (stories.length === 0) {
      console.warn('Scraper: 0 stories found — HN markup may have changed.');
      return;
    }

    await Story.deleteMany({});
    await Story.insertMany(stories);
    console.log(`Scraper: saved ${stories.length} stories to MongoDB.`);
  } catch (err) {
    console.error('Scraper error:', err.message);
  }
};

module.exports = { runScraper };
