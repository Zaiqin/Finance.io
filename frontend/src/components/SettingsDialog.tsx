import React, { useState } from "react";

interface Category {
  _id: string | undefined;
  description: string;
}

interface SettingsDialogProps {
  categories: Category[];
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
    if (newCategory && !categories.some(category => category.description === newCategory)) {
      onAddCategory(newCategory);
      setNewCategory("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Manage Categories
        </h2>
        <form
          className="mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddCategory();
          }}
        >
          <label
            className="block text-gray-700 text-m font-bold mb-2"
            htmlFor="newCategory"
          >
            Add New Category
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newCategory"
            type="text"
            value={newCategory}
            placeholder="Name"
            required
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
          >
            Add
          </button>
        </form>
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
                <span>{category.description}</span>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => onDeleteCategory(category._id!)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
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
