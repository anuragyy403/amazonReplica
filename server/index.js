require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');


connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/products', productRoutes);
app.use('/api/products', reviewRoutes);

const cartRoutes = require('./routes/cartRoutes');

app.use('/api/cart', cartRoutes);

const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);




