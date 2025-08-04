const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

// Загрузка переменных окружения
dotenv.config();

// Подключение к базе данных
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Личные кабинеты
app.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'student-dashboard.html'));
});

app.get('/teacher-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teacher-dashboard.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});