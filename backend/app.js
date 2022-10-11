const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const error = require('./middleware/error');

app.use(express.json());
app.use(cookieParser())

// import availale routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/v1', userRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', orderRoutes);

app.use(error);

module.exports = app;