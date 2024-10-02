import { Request, Response } from 'express';
import Category from '../models/categoryModel';

export const getAllCategories = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const categories = await Category.find({ user });
    res.json(categories);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user },
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const addCategory = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const { description } = req.body;

    const newCategory = new Category({
      description,
      user,
    });

    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ msg: 'Category record removed' });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};