// routes/transactions.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
let { transactions, accounts } = require('../data');

router.use(auth);

// Lấy lịch sử giao dịch của chính mình (an toàn)
router.get('/', (req, res) => {
    const myTransactions = transactions.filter(t => t.fromAccountId === req.user.accountId || t.toAccountId === req.user.accountId);
    res.json(myTransactions);
});

// Xem chi tiết một giao dịch bất kỳ (có lỗ hổng)
router.get('/:transactionId', (req, res) => {
    const transaction = transactions.find(t => t.transactionId === req.params.transactionId);
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
    res.json(transaction);
});

// Hoàn tiền cho một giao dịch (có lỗ hổng)
router.post('/:transactionId/refund', (req, res) => {
    const transaction = transactions.find(t => t.transactionId === req.params.transactionId);
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

    const fromAccount = accounts.find(acc => acc.accountId === transaction.fromAccountId);
    const toAccount = accounts.find(acc => acc.accountId === transaction.toAccountId);

    if (!fromAccount || !toAccount) return res.status(500).json({ msg: 'Account error' });

    toAccount.balance -= transaction.amount;
    fromAccount.balance += transaction.amount;

    res.json({ msg: `Refund for transaction ${transaction.transactionId} successful.`, refundedTo: fromAccount.accountId });
});

// Chuyển tiền nội bộ (có lỗ hổng nghiêm trọng)
router.post('/internal-transfer', (req, res) => {
    const { fromAccountId, toAccountId, amount } = req.body;
    const sourceAccount = accounts.find(acc => acc.accountId === fromAccountId);
    const destAccount = accounts.find(acc => acc.accountId === toAccountId);

    if (!sourceAccount || !destAccount || !amount || amount <= 0) {
        return res.status(400).json({ msg: 'Invalid transfer details' });
    }
    if (sourceAccount.balance < amount) {
        return res.status(400).json({ msg: 'Insufficient funds' });
    }

    sourceAccount.balance -= amount;
    destAccount.balance += amount;

    res.json({
        msg: 'Internal transfer successful!',
        from: fromAccountId,
        to: toAccountId,
        amount
    });
});

module.exports = router;
