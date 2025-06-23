// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
let { users } = require('../data');
router.use(auth);

// API xem thông tin người dùng theo ID (có lỗ hổng)
router.get('/:userId', (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    // LỖ HỔNG: Bất kỳ ai đăng nhập cũng có thể xem thông tin của người khác.
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

module.exports = router;
