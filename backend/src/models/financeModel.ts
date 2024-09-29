import { Schema, model, Document } from 'mongoose';

interface IFinance extends Document {
  amount: number;
  description: string;
  date: Date;
  category: string;
}

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
});

const Finance = model<IFinance>('Finance', FinanceSchema);

export default Finance;