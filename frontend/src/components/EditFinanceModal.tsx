import React, { useState } from "react";
import { format } from "date-fns";

interface Finance {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

const EditFinanceModal: React.FC<{
  finance: Finance;
  onUpdate: (updatedFinance: Finance) => void;
  onClose: () => void;
  categories: string[];
}> = ({ finance, onUpdate, onClose, categories }) => {
  const [localAmount, setLocalAmount] = useState<string>(finance.amount.toFixed(2));
  const [localDescription, setLocalDescription] = useState<string>(finance.description);
  const [localDate, setLocalDate] = useState<string>(format(new Date(finance.date), "yyyy-MM-dd"));
  const [localCategory, setLocalCategory] = useState<string>(finance.category);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedFinance = {
      ...finance,
      amount: parseFloat(localAmount),
      description: localDescription,
      date: localDate,
      category: localCategory,
    };
    onUpdate(updatedFinance);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={localCategory}
              onChange={(e) => setLocalCategory(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded w-full"
            >
              {categories.map((category: any) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                    type="number"
                    id="amount"
                    value={localAmount}
                    onChange={(e) => setLocalAmount(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 pl-8 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={localDescription}
              placeholder="Description"
              onChange={(e) => setLocalDescription(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFinanceModal;