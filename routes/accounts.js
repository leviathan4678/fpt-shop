// routes/accounts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
let { accounts } = require('../data');
router.use(auth);

// API xem số dư của chính mình (an toàn)
router.get('/me/balance', (req, res) => {
    const account = accounts.find(acc => acc.accountId === req.user.accountId);
    if (!account) return res.status(404).json({ msg: 'Account not found' });
    res.json({ balance: account.balance });
});

// API xem chi tiết tài khoản của người khác (có lỗ hổng)
router.get('/:accountId', (req, res) => {
    const accountId = parseInt(req.params.accountId, 10);
    const account = accounts.find(acc => acc.accountId === accountId);
    if (!account) return res.status(404).json({ msg: 'Account not found' });
    res.json(account);
});

module.exports = router;
