const Message = require('../models/Message');

/**
 * GET /api/messages/:otherUserId
 * Returns the full DM thread between the logged-in user and otherUserId (newest last).
 */
const getThread = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;
    const participants = [String(userId), String(otherUserId)].sort();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({ participants: { $all: participants } })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'name avatar role');

    // Mark all as read by current user
    await Message.updateMany(
      { participants: { $all: participants }, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.json({ messages, page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/messages/conversations
 * Returns a list of all unique conversations for the logged-in user
 * with the latest message and unread count per thread.
 */
const getConversations = async (req, res) => {
  try {
    const userId = String(req.user._id);

    // Get most recent message from each unique thread
    const threads = await Message.aggregate([
      { $match: { participants: { $in: [req.user._id] } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$participants',
          latestMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [{ $not: { $in: [req.user._id, '$readBy'] } }, 1, 0],
            },
          },
        },
      },
      { $sort: { 'latestMessage.createdAt': -1 } },
      { $limit: 30 },
    ]);

    // Populate the other participant's info
    const populated = await Message.populate(threads, [
      { path: 'latestMessage.sender', select: 'name avatar role' },
      { path: '_id', select: 'name avatar role', model: 'User' },
    ]);

    res.json({ conversations: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/messages/unread-count
 * Returns total unread DM count for the badge indicator.
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      participants: { $in: [req.user._id] },
      sender: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    });
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getThread, getConversations, getUnreadCount };
