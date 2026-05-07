const express = require('express');
const { runScraper } = require('../scraper/hnScraper');

const router = express.Router();

router.post('/scrape', async (req, res) => {
  try {
    await runScraper();
    res.json({ message: 'Scrape completed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
