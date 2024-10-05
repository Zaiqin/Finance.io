import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import LTADialog from "./LTADialog";
import { Preset, Tag } from "../interfaces/interface";

interface PresetsDialogProps {
  presets: Preset[];
  categories: string[];
  tags: Tag[];
  onClose: () => void;
  onAddPreset: (preset: Preset) => void;
  onDeletePreset: (presetId: string) => void;
  onEditPreset: (presetId: string, updatedPreset: Preset) => void;
}

const getContrastYIQ = (hexcolor: string) => {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

const PresetsDialog: React.FC<PresetsDialogProps> = ({
  presets,
  categories,
  tags,
  onClose,
  onAddPreset,
  onDeletePreset,
  onEditPreset,
}) => {
  const [newAmount, setNewAmount] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

  const handleEditPreset = (preset: Preset) => {
    setEditingPreset(preset);
    setNewAmount(preset.amount.toString());
    setNewDescription(preset.description);
    setNewCategory(preset.category ?? "");
    setSelectedTags(preset.tags ?? []);
  };

  const handleAddPreset = () => {
    if (editingPreset) {
      const updatedPreset = {
        ...editingPreset,
        amount: parseFloat(newAmount),
        description: newDescription,
        category: newCategory,
        tags: selectedTags,
      };
      // Call the edit function instead of add
      if (editingPreset._id) {
        onEditPreset(editingPreset._id, updatedPreset);
      }
      setEditingPreset(null);
    } else {
      if (!presets.some((preset) => preset.description === newDescription)) {
        onAddPreset({
          _id: undefined,
          amount: parseFloat(newAmount),
          description: newDescription,
          category: newCategory,
          tags: selectedTags,
        });
      }
    }
    // Reset form
    setNewAmount("");
    setNewDescription("");
    setNewCategory("");
    setSelectedTags([]);
  };

  const [isLTADialogOpen, setIsLTADialogOpen] = useState(false);

  const handleLTAOpenDialog = () => {
    setIsLTADialogOpen(true);
  };

  const handleLTACloseDialog = () => {
    setIsLTADialogOpen(false);
  };

  const handleLTASubmitDialog = (fare: number, description: string) => {
    setIsLTADialogOpen(false);
    setNewAmount(fare.toFixed(2));
    setNewDescription(description);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-6">
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
            <div className="relative mb-3">
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
            <div className="mb-4">
              <div className="relative">
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="tags"
                  value=""
                  onChange={(e) => {
                    const selectedTag = tags.find(
                      (tag) => tag._id === e.target.value
                    );
                    if (
                      selectedTag &&
                      !selectedTags.some((tag) => tag._id === selectedTag._id)
                    ) {
                      setSelectedTags([...selectedTags, selectedTag]);
                    }
                  }}
                >
                  <option value="" disabled>
                    -- Select tag(s) --
                  </option>
                  {tags.map((tag) => (
                    <option
                      key={tag._id}
                      value={tag._id}
                      style={{
                        backgroundColor: tag.color,
                        color: getContrastYIQ(tag.color),
                      }}
                    >
                      {tag.name}
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
              <div
                className={`flex flex-wrap gap-2 ${
                  selectedTags.length > 0 ? "mb-3 mt-3" : ""
                }`}
              >
                <div className="flex justify-left">
                  {selectedTags.map((tag, index) => {
                    const textColor = getContrastYIQ(tag.color);
                    return (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-white mr-2 shadow-md rounded-md"
                        style={{
                          backgroundColor: tag.color,
                          color: textColor,
                          borderRadius: "0.5rem",
                        }}
                      >
                        {tag.name}
                        <button
                          type="button"
                          className="ml-2 pb-1 text-white"
                          onClick={() =>
                            setSelectedTags(
                              selectedTags.filter((t) => t._id !== tag._id)
                            )
                          }
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-left items-left mt-3">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mr-3 rounded focus:outline-none focus:shadow-outline flex items-center"
                type="button"
                onClick={handleLTAOpenDialog}
              >
                <FaPlus className="mr-2" /> <span>Public Transport</span>
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editingPreset ? "Update" : "Add"}
              </button>
              {editingPreset && (
                <button
                  type="button"
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3"
                  onClick={() => {
                    setEditingPreset(null);
                    setNewAmount("");
                    setNewDescription("");
                    setNewCategory("");
                    setSelectedTags([]);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Existing Presets
            </h3>
            <ul className="overflow-y-auto overflow-x-auto max-h-[30vh] mr-2 pt-2 pb-2">
              {presets.map((preset, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center mb-2"
                >
                  <span
                    className="mr-2 flex-shrink-0"
                    style={{ width: "65%", wordWrap: "break-word" }}
                  >
                    {preset.description}
                  </span>
                  <div className="flex flex-row space-x-2">
                    <button
                      type="button"
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleEditPreset(preset)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => preset._id && onDeletePreset(preset._id)}
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
      <LTADialog
        open={isLTADialogOpen}
        onClose={handleLTACloseDialog}
        onSubmit={handleLTASubmitDialog}
      />
    </>
  );
};

export default PresetsDialog;
