const express = require('express');
const { getStories, getStory, toggleBookmark, getBookmarks } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getStories);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:id', getStory);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
