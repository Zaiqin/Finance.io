import { Schema, model, Document } from 'mongoose';

interface Tag {
  name: string;
  color: string;
}

interface IFinance extends Document {
  amount: number;
  description: string;
  date: Date;
  category: string;
  user: string;
  tags?: Tag[];
}

const TagSchema = new Schema<Tag>({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

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
    type: [TagSchema],
    required: false,
  },
});

const Finance = model<IFinance>('Finance', FinanceSchema);

export default Finance;