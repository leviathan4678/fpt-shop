// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let { users, accounts, nextUserId, nextAccountId } = require('../data');

// API đăng ký người dùng mới
router.post('/register', async (req, res) => {
    const { username, password, name } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ msg: 'Vui lòng cung cấp username và password.' });
        }
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ msg: 'Tên người dùng đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccountId = nextAccountId++;
        const newAccount = { accountId: newAccountId, balance: 100000 };
        accounts.push(newAccount);

        const newUser = {
            id: nextUserId++,
            username,
            password: hashedPassword,
            name: name || username,
            role: 'customer',
            accountId: newAccountId
        };
        users.push(newUser);

        const payload = {
            user: { id: newUser.id, username: newUser.username, role: newUser.role, accountId: newUser.accountId }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ msg: 'Đăng ký thành công và đã tự động đăng nhập.', token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
});

// API đăng nhập
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = users.find(u => u.username === username);
        if (!user) return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ' });

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                accountId: user.accountId
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
});

module.exports = router;
