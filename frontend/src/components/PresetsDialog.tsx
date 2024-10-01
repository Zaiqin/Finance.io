import React, { useState } from "react";

interface Preset {
  _id: string | undefined;
  amount: number;
  description: string;
  category: string | undefined;
}

interface PresetsDialogProps {
  presets: Preset[];
  categories: string[];
  onClose: () => void;
  onAddPreset: (preset: Preset) => void;
  onDeletePreset: (presetId: string) => void;
}

const PresetsDialog: React.FC<PresetsDialogProps> = ({
  presets,
  categories,
  onClose,
  onAddPreset,
  onDeletePreset,
}) => {
  const [newAmount, setNewAmount] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");

  const handleAddPreset = () => {
    if (!presets.some((preset) => preset.description === newDescription)) {
      onAddPreset({
        _id: undefined,
        amount: parseFloat(newAmount),
        description: newDescription,
        category: newCategory,
      });
      setNewAmount("");
      setNewDescription("");
      setNewCategory("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Manage Presets
        </h2>
        <form
          className="mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddPreset();
          }}
        >
          <label
            className="block text-gray-700 text-m font-bold mb-2"
            htmlFor="newPreset"
          >
            Add New Preset
          </label>
          <div className="mb-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 pl-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                id="amount"
                value={newAmount}
                placeholder="Amount"
                required
                onChange={(e) => {
                  setNewAmount(e.target.value);
                }}
              />
            </div>
          </div>
          <input
            className="shadow appearance-none border rounded w-full mb-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newPreset"
            type="text"
            value={newDescription}
            placeholder="Description"
            required
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <div className="relative mb-1">
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              value={newCategory || ""}
              required
              onChange={(e) => {
                setNewCategory(e.target.value);
              }}
            >
              <option value="" disabled>
                -- Select a Category --
              </option>
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
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
          >
            Add
          </button>
        </form>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Existing Presets
          </h3>
          <ul>
            {presets.map((preset, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{preset.description}</span>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => preset._id && onDeletePreset(preset._id)}
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

export default PresetsDialog;
