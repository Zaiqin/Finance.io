import React, { useState } from "react";
import { FaCog } from "react-icons/fa"; // Import the FontAwesome icon

interface Finance {
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface FinanceFormProps {
  addFinance: (finance: Finance) => void;
  categories: string[];
  onOpenSettings: () => void;
}

const FinanceForm: React.FC<FinanceFormProps> = ({ addFinance, categories, onOpenSettings }) => {
  const [rawAmount, setRawAmount] = useState<string>(''); // Store raw input value
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Set today's date by default
  const [category, setCategory] = useState<string>(categories[0]); // Set the first category by default

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.-]/g, ''); // Allow numbers, decimal point, and minus sign
    setRawAmount(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAmount = parseFloat(rawAmount).toFixed(2);
    const finance = { amount: parseFloat(formattedAmount), description, date, category };
    addFinance(finance);
    // Reset form after submission
    setRawAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory(categories[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Finance</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 pl-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            id="amount"
            value={rawAmount}
            placeholder="Amount"
            required
            onChange={handleAmountChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          type="text"
          value={description}
          placeholder="Description"
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="date"
          type="date"
          value={date}
          required
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Category
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="category"
          value={category}
          onChange={(e) => {setCategory(e.target.value)}}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          type="button"
          onClick={onOpenSettings}
        >
          <FaCog className="mr-2" /> <span>Edit Categories</span>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => {
            setRawAmount('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
            setCategory(categories[0]);
          }}
        >
          Clear
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default FinanceForm;