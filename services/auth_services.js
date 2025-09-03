import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import ApiError from '../utils/ApiError.js';
import Solution from '../models/Solution.js'; // Добавлен импорт Solution

class AuthService {
  // Регистрация нового пользователя (врача)
  async register(email, password, name, specialization, experienceYears) {
    // Валидация входных данных
    if (!email || !password || !name || !specialization || !experienceYears) {
      throw ApiError.badRequest('Все поля обязательны для заполнения');
    }

    const candidate = await User.findOne({ email });
    if (candidate) {
      throw ApiError.badRequest('Пользователь с таким email уже существует');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const userRole = await Role.findOne({value: 'user'});
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      specialization,
      experienceYears,
      role: userRole.value,
    });
    
    return { message: "Регистрация прошла успешно" };
  }

  // Вход в систему
  async login(email, password) {
    if (!email || !password) {
      throw ApiError.badRequest('Email и пароль обязательны');
    }

    const user = await User.findOne({ email })//.select('+password');
    if (!user) {
      throw ApiError.badRequest('Неверный email или пароль'); // Унифицированное сообщение для безопасности
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.badRequest('Неверный email или пароль');
    }

    const token = this.generateToken(user);
    return token;
  }

  // Генерация JWT-токена
  generateToken(user) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET не установлен в .env файле');
    }
    
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  // Валидация токена (для middleware)
  validateToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return null;
    }
  }
}

export default new AuthService();