const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getThread, getConversations, getUnreadCount } = require('../controllers/messageController');

router.use(protect); // all message routes require auth

router.get('/conversations', getConversations);
router.get('/unread-count', getUnreadCount);
router.get('/:otherUserId', getThread);

module.exports = router;
