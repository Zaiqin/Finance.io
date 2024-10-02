import { Schema, model, Document } from 'mongoose';

interface ICategory extends Document {
  description: string;
  user: string;
}

const CategorySchema = new Schema<ICategory>({
  description: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const Category = model<ICategory>('Category', CategorySchema);

export default Category;