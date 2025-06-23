// index.js
const express = require('express');
require('dotenv').config();
const app = express();
const port = 3000;
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/users', require('./routes/users'));

app.listen(port, () => console.log(`Ứng dụng đang chạy tại http://localhost:${port}`));
