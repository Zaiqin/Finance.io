import { Request, Response } from 'express';
import Preset from '../models/presetModel';

export const getAllPresets = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const presets = await Preset.find({ user });
    res.json(presets);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const updatePreset = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const preset = await Preset.findOneAndUpdate(
      { _id: req.params.id, user },
      req.body,
      { new: true }
    );
    if (!preset) {
      return res.status(404).json({ message: 'Preset not found' });
    }
    res.json(preset);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const addPreset = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const { amount, description, category } = req.body;

    const newPreset = new Preset({
      amount,
      description,
      category,
      user,
    });

    const preset = await newPreset.save();
    res.status(201).json(preset);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const deletePreset = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const preset = await Preset.findOneAndDelete({ _id: req.params.id, user });
    if (!preset) {
      return res.status(404).json({ message: 'Preset not found' });
    }
    res.json({ msg: 'Preset record removed' });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};