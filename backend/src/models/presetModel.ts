import { Schema, model, Document } from 'mongoose';

interface IPreset extends Document {
  amount: number;
  description: string;
  category: string;
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
});

const Preset = model<IPreset>('Preset', PresetSchema);

export default Preset;