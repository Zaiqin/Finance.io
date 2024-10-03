import { Request, Response } from 'express';
import Tag from '../models/tagModel';

// Get all tags
export const getTags = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const tags = await Tag.find({ user });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};

// Create a new tag
export const createTag = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const { name, color } = req.body;
    const newTag = new Tag({ name, color, user });
    const savedTag = await newTag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    res.status(400).json({ message: 'Error creating tag', error });
  }
};

// Update a tag
export const updateTag = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const updatedTag = await Tag.findOneAndUpdate({ _id: id, user }, { name, color }, { new: true });
    if (!updatedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json(updatedTag);
  } catch (error) {
    res.status(400).json({ message: 'Error updating tag', error });
  }
};

// Delete a tag
export const deleteTag = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const { id } = req.params;
    const deletedTag = await Tag.findOneAndDelete({ _id: id, user });
    if (!deletedTag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting tag', error });
  }
};