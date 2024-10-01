import { Request, Response } from 'express';
import Category from '../models/categoryModel';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(category);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    const newCategory = new Category({
      description,
    });

    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Category record removed' });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};
