import React, { useState } from "react";

interface SettingsDialogProps {
  categories: string[];
  onClose: () => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  categories,
  onClose,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      onAddCategory(newCategory);
      setNewCategory("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Manage Categories
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="newCategory"
          >
            Add New Category
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newCategory"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            onClick={handleAddCategory}
          >
            Add
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Existing Categories
          </h3>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{category}</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => onDeleteCategory(category)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
