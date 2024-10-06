import React, { useState, useEffect } from "react";
import { Category } from "../interfaces/interface";

interface SettingsDialogProps {
  categories: Category[];
  onClose: () => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onUpdateCategory: (id: string, updatedCategory: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  categories,
  onClose,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedCategory) {
      setNewCategory(selectedCategory.description);
    } else {
      setNewCategory("");
    }
  }, [selectedCategory]);

  const handleAddOrUpdateCategory = () => {
    if (newCategory && !categories.some(category => category.description === newCategory)) {
      if (selectedCategory) {
        onUpdateCategory(selectedCategory._id!, newCategory);
      } else {
        onAddCategory(newCategory);
      }
      setNewCategory("");
      setSelectedCategory(null);
    } else {
      setError("Category already exists or is empty.");
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleCancelEdit = () => {
    setSelectedCategory(null);
    setNewCategory("");
    setError("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Manage Categories
        </h2>
        <form
          className="mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdateCategory();
          }}
        >
          <label
            className="block text-gray-700 text-m font-bold mb-2"
            htmlFor="newCategory"
          >
            {selectedCategory ? "Edit Category" : "Add New Category"}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newCategory"
            type="text"
            value={newCategory}
            placeholder="Name"
            required
            maxLength={30}
            onChange={(e) => {
              if (e.target.value.length <= 30) setNewCategory(e.target.value);
            }}
          />
          {error && (
            <p className="text-red-500 text-sm italic mt-1">{error}</p>
          )}
          <div className="flex space-x-2 mt-3">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {selectedCategory ? "Update" : "Add"}
            </button>
            {selectedCategory && (
              <button
                type="button"
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 mr-2">
            Existing Categories
          </h3>
          <ul className="overflow-y-auto max-h-[30vh] pr-2">
            {categories.map((category, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{category.description}</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => onDeleteCategory(category._id!)}
                  >
                    Delete
                  </button>
                </div>
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
