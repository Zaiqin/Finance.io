import React, { useState } from "react";
import { FaCog, FaPlus } from "react-icons/fa"; // Import the FontAwesome icon
import LTADialog from "./LTADialog";
import { Preset, Tag } from "../interfaces/interface"; // Import the Preset interface
import { Finance, Category } from "../interfaces/interface"; // Import the Finance interface
import TagDialog from "./TagDialog";

// Function to calculate contrast color
const getContrastYIQ = (hexcolor: string) => {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

interface FinanceFormProps {
  addFinance: (finance: Finance) => void;
  categories: Category[];
  onOpenSettings: () => void;
  onOpenPresets: () => void;
  onClose: () => void;
  presets: Preset[];
  addTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  updateTag: (id: string, updatedTag: Tag) => void;
  tags: Tag[];
  nightMode: boolean;
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
  onOpenPresets,
  onClose,
  presets,
  addTag,
  deleteTag,
  updateTag,
  tags,
  nightMode
}) => {
  const [rawAmount, setRawAmount] = useState<string>(""); // Store raw input value
  const [description, setDescription] = useState<string>("");
  // Initialize with the current date using resetTime
  const [date, setDate] = useState<string>(formatDate(resetTime(new Date())));
  const [category, setCategory] = useState<string | undefined>(undefined); // Set the first category by default
  const [preset, setPreset] = useState<Preset | undefined>(undefined); // Set the first category by default
  const [isLTADialogOpen, setIsLTADialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const handleLTAOpenDialog = () => {
    setIsLTADialogOpen(true);
  };

  const handleLTACloseDialog = () => {
    setIsLTADialogOpen(false);
  };

  const handleLTASubmitDialog = (fare: number, description: string) => {
    setIsLTADialogOpen(false);
    setRawAmount(fare.toFixed(2));
    setDescription(description);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.-]/g, ""); // Allow numbers, decimal point, and minus sign
    setRawAmount(value);
  };

  const handleTagDialogOpen = () => {
    setIsTagDialogOpen(true);
  };

  const handleTagDialogClose = () => {
    setIsTagDialogOpen(false);
    updateSelectedTags()
  };

  const handleTagSubmit = async (tag: Tag) => {
    if (tag._id) {
      updateTag(tag._id, tag);
    }
    updateSelectedTags();
  };

  const handleTagDelete = async (id: string) => {
    deleteTag(id);
    updateSelectedTags();
  };

  const updateSelectedTags = () => {
    //console.log(selectedTags);
    //console.log(tags);
    const updatedTags = selectedTags
      .map((selectedTag) => {
        const updatedTag = tags.find((tag) => tag._id === selectedTag._id);
        return updatedTag ? updatedTag : selectedTag;
      })
      .filter((tag) => tags.some((t) => t._id === tag._id)); // Remove tags that are no longer in the tags list
    setSelectedTags(updatedTags);
  };

  // In handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAmount = parseFloat(rawAmount).toFixed(2);
    const finance = {
      _id: undefined,
      amount: parseFloat(formattedAmount),
      description,
      date, // Use the current state for date
      category: category || "",
      tags: selectedTags,
    };
    addFinance(finance);
    // Reset form after submission
    setRawAmount("");
    setDescription("");
    // setDate(formatDate(resetTime(new Date()))); // Reset to current date
    setCategory(undefined);
    setSelectedTags([]);
    setPreset(undefined);
  };

  const handlePresetChange = (p: string) => {
    const selectedPreset = presets.find((f) => f.description === p);
    if (selectedPreset) {
      //console.log(selectedPreset);
      setPreset(selectedPreset);
      setRawAmount(selectedPreset.amount.toString());
      setDescription(selectedPreset.description);
      setCategory(selectedPreset.category);
      setSelectedTags(selectedPreset.tags || []);
    } else {
      //console.log("Preset not found!");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl rounded-lg ${
          nightMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-semibold mb-4 ${
        nightMode ? "text-white" : "text-gray-800"
          }`}
        >
          Add Finance Item
        </h2>

        <div className="overflow-y-auto max-h-[40vh] pr-6">
          <div className="mb-4">
        <label
          className={`block text-sm font-bold mb-2 ${
            nightMode ? "text-white" : "text-gray-700"
          }`}
          htmlFor="amount"
        >
          Amount
        </label>
        <div className="relative">
          <span
            className={`absolute inset-y-0 left-0 pl-3 flex items-center ${
          nightMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            $
          </span>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 pl-8 leading-tight focus:outline-none focus:shadow-outline ${
          nightMode
            ? "bg-gray-700 text-white border-gray-600"
            : "text-gray-700"
            }`}
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
          className={`block text-sm font-bold mb-2 ${
            nightMode ? "text-white" : "text-gray-700"
          }`}
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
            nightMode
          ? "bg-gray-700 text-white border-gray-600"
          : "text-gray-700"
          }`}
          id="description"
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
          </div>
          <div className="mb-4">
        <label
          className={`block text-sm font-bold mb-2 ${
            nightMode ? "text-white" : "text-gray-700"
          }`}
          htmlFor="date"
        >
          Date
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
            nightMode
          ? "bg-gray-700 text-white border-gray-600"
          : "text-gray-700"
          }`}
          id="date"
          type="date"
          value={date}
          required
          onChange={(e) => setDate(e.target.value)}
        />
          </div>
          <div className="mb-4">
        <label
          className={`block text-sm font-bold mb-2 ${
            nightMode ? "text-white" : "text-gray-700"
          }`}
          htmlFor="category"
        >
          Category
        </label>
        <div className="relative">
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
          nightMode
            ? "bg-gray-700 text-white border-gray-600"
            : "text-gray-700"
            }`}
            id="category"
            value={category || ""}
            required
            onChange={(e) => {
          console.log(e);
          setCategory(e.target.value);
            }}
          >
            <option value="" disabled>
          -- Select a Category --
            </option>
            {categories.map((category, index) => (
          <option key={index} value={category._id}>
            {category.description}
          </option>
            ))}
          </select>
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
          nightMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
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
        <label
          className={`block text-sm font-bold mb-2 ${
            nightMode ? "text-white" : "text-gray-700"
          }`}
          htmlFor="tags"
        >
          Tags
        </label>
        <div
          className={`flex flex-wrap gap-2 ${
            selectedTags.length > 0 ? "mb-3" : ""
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
            borderRadius: "0.5rem", // Less rounded corners
              }}
            >
              {tag.name}
              <button
            type="button"
            className="ml-2 text-white"
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
        <div className="relative">
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
          nightMode
            ? "bg-gray-700 text-white border-gray-600"
            : "text-gray-700"
            }`}
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
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
          nightMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
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
        <label
          className={`block text-sm font-bold mb-2 ${
            nightMode ? "text-white" : "text-gray-700"
          }`}
          htmlFor="category"
        >
          Presets
        </label>
        <div className="relative">
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
          nightMode
            ? "bg-gray-700 text-white border-gray-600"
            : "text-gray-700"
            }`}
            id="category"
            value={preset?.description || ""}
            onChange={(e) => {
          handlePresetChange(e.target.value);
            }}
          >
            <option value="" disabled>
          -- Select a preset --
            </option>
            {presets.map((preset, index) => (
          <option key={index} value={preset.description}>
            {preset.description}
          </option>
            ))}
          </select>
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${
          nightMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
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
        </div>
        <div className="mb-3 flex space-x-2 mt-3 flex items-left justify-left">
          <button
        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
          nightMode
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-gray-500 hover:bg-gray-700 text-white"
        }`}
        type="button"
        onClick={onOpenSettings}
          >
        <FaCog className="mr-2" /> <span>Categories</span>
          </button>
          <button
        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
          nightMode
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-gray-500 hover:bg-gray-700 text-white"
        }`}
        type="button"
        onClick={onOpenPresets}
          >
        <FaCog className="mr-2" /> <span>Presets</span>
          </button>
        </div>
        <div className="mb-3 flex space-x-2 items-center justify-left">
          <button
        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
          nightMode
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-gray-500 hover:bg-gray-700 text-white"
        }`}
        type="button"
        onClick={handleLTAOpenDialog}
          >
        <FaPlus className="mr-2" /> <span>Public Transport</span>
          </button>
          <button
        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ${
          nightMode
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-gray-500 hover:bg-gray-700 text-white"
        }`}
        type="button"
        onClick={handleTagDialogOpen}
          >
        <FaCog className="mr-2" /> <span>Tags</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button
        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          nightMode
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-gray-500 hover:bg-gray-700 text-white"
        }`}
        type="button"
        onClick={() => {
          setRawAmount("");
          setDescription("");
          setDate(formatDate(resetTime(new Date()))); // Reset to current date
          setCategory(undefined);
          setPreset(undefined);
          setSelectedTags([]);
        }}
          >
        Clear
          </button>
          <div className="flex space-x-2">
        <button
          type="button"
          onClick={onClose}
          className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            nightMode
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-red-500 hover:bg-red-700 text-white"
          }`}
        >
          Close
        </button>
        <button
          className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            nightMode
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
          type="submit"
        >
          Add
        </button>
          </div>
        </div>
      </form>
      <LTADialog
        open={isLTADialogOpen}
        onClose={handleLTACloseDialog}
        onSubmit={handleLTASubmitDialog}
        nightMode={nightMode}
      />
      <TagDialog
        open={isTagDialogOpen}
        onClose={handleTagDialogClose}
        onSubmit={handleTagSubmit}
        onDelete={handleTagDelete}
        existingTags={tags}
        addTag={addTag}
        deleteTag={deleteTag}
        updateTag={updateTag}
      />
    </>
  );
};

export default FinanceForm;
