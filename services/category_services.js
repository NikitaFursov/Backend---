// src/services/category_service.js
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';

class CategoryService {
  async createCategory(categoryData) {
    const existingCategory = await Category.findOne({ name: categoryData.name });
    if (existingCategory) {
      throw ApiError.badRequest('Категория с таким названием уже существует');
    }
    return Category.create(categoryData);
  }

  async getCategories() {
    return Category.find();
  }

  async getCategoryById(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw ApiError.notFound('Категория не найдена');
    }
    return category;
  }

  async updateCategory(categoryId, updateData) {
    // Фильтруем поля, оставляем только разрешенные
    const allowedUpdates = ['name', 'description', 'icon'];
    const updates = Object.keys(updateData)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
        }, {});

    // Если после фильтрации не осталось полей для обновления
    if (Object.keys(updates).length === 0) {
        throw ApiError.badRequest('Нет разрешенных полей для обновления');
    }

    const category = await Category.findByIdAndUpdate(
        categoryId,
        updates, // Используем отфильтрованные данные
        { new: true, runValidators: true }
    );
    
    if (!category) {
        throw ApiError.notFound('Категория не найдена');
    }
    
    return category;
    }
}

export default new CategoryService();