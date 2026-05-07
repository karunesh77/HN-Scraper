const Story = require('../models/Story');
const User = require('../models/User');

const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1 }).skip(skip).limit(limit),
      Story.countDocuments(),
    ]);

    res.json({
      stories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const user = req.user;
    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {
      await User.findByIdAndUpdate(user._id, { $pull: { bookmarks: storyId } });
    } else {
      await User.findByIdAndUpdate(user._id, { $addToSet: { bookmarks: storyId } });
    }

    res.json({ bookmarked: !isBookmarked, storyId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json(user.bookmarks.sort((a, b) => b.points - a.points));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStories, getStory, toggleBookmark, getBookmarks };
