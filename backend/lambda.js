require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { runScraper } = require('./scraper/hnScraper');

const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({
  origin: ['https://hn-scraper.vercel.app', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api', scrapeRoutes);

app.use(notFound);
app.use(errorHandler);

let isConnected = false;

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    await connectDB();
    await runScraper();
    isConnected = true;
  }

  return serverless(app)(event, context);
};

module.exports = { handler };
