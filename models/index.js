import mongoose from 'mongoose';
import User from './User.js';
import Task from './Task.js';
import Solution from './Solution.js';
import Category from './Category.js';

// Опционально: создание индексов или дополнительные настройки
Task.createIndexes({ title: 'text', description: 'text' });
Category.createIndexes({ name: 'text' });

export {
  User,
  Task,
  Solution,
  Category
};