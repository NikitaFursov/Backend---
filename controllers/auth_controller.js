import authService from '../services/auth_services.js';

export default {

  async register(req, res, next) {
    try {
      const { email, password, name, specialization, experienceYears } = req.body;
      const statusRegisterUser = await authService.register(email, password, name, specialization, experienceYears);
      res.status(201).json({ statusRegisterUser });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json({ token });
    } catch (err) {
      next(err);
    }
  },

};