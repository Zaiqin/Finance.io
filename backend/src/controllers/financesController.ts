import { Request, Response } from 'express';
import Finance from '../models/financeModel';

export const getAllFinances = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const finances = await Finance.find({ user });
    res.json(finances);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const getFinances = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const month = req.params.month;
    const category = req.query.category as string;

    // Create a date range for the specified month
    const startDate = new Date(`2023-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    let query: any = {
      user,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    };

    if (category) {
      query.category = category;
    }

    const finances = await Finance.find(query);
    res.json(finances);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const updateFinance = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const finance = await Finance.findOneAndUpdate(
      { _id: req.params.id, user },
      req.body,
      { new: true }
    );
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    res.json(finance);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const addFinance = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const { amount, description, date, category } = req.body;

    const newFinance = new Finance({
      amount,
      description,
      date,
      category,
      user,
    });

    const finance = await newFinance.save();
    res.status(201).json(finance);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};

export const deleteFinance = async (req: Request, res: Response) => {
  const user = req.headers['user'] as string;
  if (!user) {
    return res.status(400).json({ message: 'User header is required' });
  }

  try {
    const finance = await Finance.findOneAndDelete({ _id: req.params.id, user });
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    res.json({ msg: 'Finance record removed' });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server Error');
  }
};