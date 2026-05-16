const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const chatRoutes = require('./routes/chatRoutes');

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('PetCare Backend is running!');
});

const sequelize = require('./config/db');

sequelize.sync({ alter: true })
  .then(() => console.log('Connected to Local SQLite Database successfully!'))
  .catch(err => {
    console.error('Database connection error:', err.message);
  });

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
