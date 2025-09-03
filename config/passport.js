import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

// Локальная стратегия
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return done(ApiError.unauthorized('Неверные учетные данные'), false);
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return done(ApiError.unauthorized('Неверные учетные данные'), false);
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// JWT стратегия
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) return done(ApiError.unauthorized('Пользователь не найден'), false);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

export default passport;