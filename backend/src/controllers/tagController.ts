import { Request, Response } from 'express';
import Tag from '../models/tagModel';

// Get all tags
export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};

// Create a new tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const newTag = new Tag({ name, color });
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(400).json({ message: 'Error creating tag', error });
  }
};

// Update a tag
export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const updatedTag = await Tag.findByIdAndUpdate(id, { name, color }, { new: true });
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(400).json({ message: 'Error updating tag', error });
  }
};

// Delete a tag
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Tag.findByIdAndDelete(id);
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting tag', error });
  }
};