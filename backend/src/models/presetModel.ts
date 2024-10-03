import { Schema, model, Document } from 'mongoose';
import { TagSchema, ITag } from './tagModel';

interface IPreset extends Document {
  amount: number;
  description: string;
  category: string;
  user: string;
  tags?: ITag[];
}

const PresetSchema = new Schema<IPreset>({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
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

const Preset = model<IPreset>('Preset', PresetSchema);

export default Preset;