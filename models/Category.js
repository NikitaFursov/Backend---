import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название категории обязательно'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Описание категории обязательно']
  },
  icon: {
    type: String,
    default: 'default-icon.svg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Category', categorySchema);