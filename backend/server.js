require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { runScraper } = require('./scraper/hnScraper');

const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api', scrapeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await runScraper();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
