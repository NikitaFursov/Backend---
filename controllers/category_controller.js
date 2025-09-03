import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';

export default {
  // Создание новой категории
  async createCategory(req, res, next) {
    try {
      const { name, description, icon } = req.body;
      const category = await Category.create({ name, description, icon });
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  },

  // Получение всех категорий
  async getCategories(req, res, next) {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  },

  // Получение категории по ID
  async getCategoryById(req, res, next) {
    try {
      const category = await Category.findById(req.params.categoryId);
      if (!category) {
        throw ApiError.notFound('Категория не найдена');
      }
      res.json(category);
    } catch (err) {
      next(err);
    }
  },

  // Обновление категории
  async updateCategory(req, res, next) {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.categoryId,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedCategory) {
        throw ApiError.notFound('Категория не найдена');
      }
      res.json(updatedCategory);
    } catch (err) {
      next(err);
    }
  },

  // Удаление категории
  async deleteCategory(req, res, next) {
    try {
      const category = await Category.findByIdAndDelete(req.params.categoryId);
      if (!category) {
        throw ApiError.notFound('Категория не найдена');
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};