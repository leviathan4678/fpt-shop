// data.js
const bcrypt = require('bcrypt');
const hashPassword = (password) => bcrypt.hashSync(password, 10);

// Bảng "accounts" chứa thông tin tài khoản và số dư
let accounts = [
    { accountId: 100, balance: 5000000 }, // Tài khoản của An
    { accountId: 200, balance: 2500000 }, // Tài khoản của Bình (kẻ tấn công)
    { accountId: 900, balance: 100000000 } // Tài khoản của cửa hàng
];
let nextAccountId = 300;

// Bảng "users" chứa thông tin người dùng và liên kết tới tài khoản của họ
let users = [
    { id: 1, username: 'an', password: hashPassword('pass_an'), name: 'Nguyễn Văn An', role: 'customer', accountId: 100 },
    { id: 2, username: 'binh', password: hashPassword('pass_binh'), name: 'Trần Văn Bình', role: 'customer', accountId: 200 },
    { id: 9, username: 'fptshop', password: hashPassword('pass_fpt'), name: 'Cửa hàng FPT Shop', role: 'merchant', accountId: 900 }
];
let nextUserId = 10;

// Bảng "transactions" ghi lại lịch sử giao dịch
let transactions = [
    { transactionId: 'txn_111', fromAccountId: 100, toAccountId: 900, amount: 1200000, description: 'Mua bàn phím cơ', timestamp: new Date() },
    { transactionId: 'txn_222', fromAccountId: 200, toAccountId: 900, amount: 750000, description: 'Mua chuột gaming', timestamp: new Date() }
];

module.exports = { users, accounts, transactions, nextUserId, nextAccountId };
