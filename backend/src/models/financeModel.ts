import { Schema, model, Document } from 'mongoose';
import { TagSchema, ITag } from './tagModel';

// Define the IFinance interface extending Document
interface IFinance extends Document {
  amount: number;
  description: string;
  date: Date;
  category: string;
  user: string;
  tags?: ITag[];
}

// Define the Finance schema using IFinance
const FinanceSchema = new Schema<IFinance>({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  tags: {
    type: [TagSchema], // Use the TagSchema for embedding tags
    required: false,
  },
});

// Create the Finance model
const Finance = model<IFinance>('Finance', FinanceSchema);

export default Finance;
