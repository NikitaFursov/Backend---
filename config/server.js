const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const environment = process.env.NODE_ENV;

export default { PORT, DB_URL, environment };
  
  
  /*
  // Настройки сессий (если используются)
  sessionOptions: {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 день
    }
  },
  
  // Настройки rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100 // лимит запросов с одного IP
  }*/