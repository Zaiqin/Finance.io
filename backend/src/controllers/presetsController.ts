import { Request, Response } from 'express';
import Preset from '../models/presetModel';

export const getAllPresets = async (req: Request, res: Response) => {
  try {
    const presets = await Preset.find();
    res.json(presets);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const updatePreset = async (req: Request, res: Response) => {
  try {
    const preset = await Preset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(preset);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const addPreset = async (req: Request, res: Response) => {
  try {
    const { amount, description, category } = req.body;

    const newPreset = new Preset({
      amount,
      description,
      category,
    });

    const preset = await newPreset.save();
    res.status(201).json(preset);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const deletePreset = async (req: Request, res: Response) => {
  try {
    await Preset.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Preset record removed' });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};