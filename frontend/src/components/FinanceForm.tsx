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
  onClose: () => void;
}

// Add the resetTime function
const resetTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Function to format date as yyyy-MM-dd
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const FinanceForm: React.FC<FinanceFormProps> = ({
  addFinance,
  categories,
  onOpenSettings,
  onClose,
}) => {
  const [rawAmount, setRawAmount] = useState<string>(""); // Store raw input value
  const [description, setDescription] = useState<string>("");
  // Initialize with the current date using resetTime
  const [date, setDate] = useState<string>(formatDate(resetTime(new Date())));
  const [category, setCategory] = useState<string>(categories[0]); // Set the first category by default

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.-]/g, ""); // Allow numbers, decimal point, and minus sign
    setRawAmount(value);
  };

  // In handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAmount = parseFloat(rawAmount).toFixed(2);
    const finance = {
      amount: parseFloat(formattedAmount),
      description,
      date, // Use the current state for date
      category,
    };
    addFinance(finance);
    // Reset form after submission
    setRawAmount("");
    setDescription("");
    setDate(resetTime(new Date()).toISOString().split("T")[0]); // Reset to current date
    setCategory(categories[0]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl bg-white rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Finance</h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amount"
        >
          Amount
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            $
          </span>
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
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          type="text"
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="date"
        >
          Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="date"
          type="date"
          value={date}
          required
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="category"
        >
          Category
        </label>
        <div className="relative">
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
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
            setRawAmount("");
            setDescription("");
            setDate(resetTime(new Date()).toISOString().split("T")[0]); // Reset to current date
            setCategory(categories[0]);
          }}
        >
          Clear
        </button>
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

export default FinanceForm;
