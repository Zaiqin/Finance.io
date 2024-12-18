import React, { useState } from "react";
import { format } from "date-fns";
import { FaPlus } from "react-icons/fa";
import LTADialog from "./LTADialog";
import { Finance, Tag, Category } from "../interfaces/interface";

const EditFinanceModal: React.FC<{
  finance: Finance;
  onUpdate: (updatedFinance: Finance) => void;
  onClose: () => void;
  categories: Category[];
  tags: Tag[];
  nightMode: boolean;
}> = ({ finance, onUpdate, onClose, categories, tags, nightMode }) => {
  const [localAmount, setLocalAmount] = useState<string>(finance.amount.toFixed(2));
  const [localDescription, setLocalDescription] = useState<string>(finance.description);
  const [localDate, setLocalDate] = useState<string>(format(new Date(finance.date), "yyyy-MM-dd"));
  const [localCategory, setLocalCategory] = useState<string>(finance.category);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(finance.tags?.filter((tag): tag is Tag => tag._id !== undefined) || []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedFinance = {
      ...finance,
      amount: parseFloat(localAmount),
      description: localDescription,
      date: localDate,
      category: localCategory,
      tags: selectedTags,
    };
    onUpdate(updatedFinance);
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
    setLocalAmount(fare.toFixed(2));
    setLocalDescription(description);
  };

  const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  return (
    <>
      <div className={`fixed inset-0 flex items-center justify-center ${nightMode ? 'bg-gray-900' : 'bg-black'} bg-opacity-50 z-20 p-6`}>
        <div className={`${nightMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg w-full max-w-md relative`}>
          <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
          <form onSubmit={handleSubmit}>
          <div className="overflow-y-auto max-h-[40vh] pr-6">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={localCategory}
                  onChange={(e) => setLocalCategory(e.target.value)}
                  required
                  className={`${nightMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700'} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category._id}>
                      {category.description}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg
                    className={`${nightMode ? 'text-white' : 'text-gray-700'} fill-current h-4 w-4`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className={`${nightMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                </span>
                <input
                  type="number"
                  id="amount"
                  value={localAmount}
                  onChange={(e) => setLocalAmount(e.target.value)}
                  required
                  className={`${nightMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700'} shadow appearance-none border rounded w-full py-2 pl-8 pr-3 leading-tight focus:outline-none focus:shadow-outline`}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={localDescription}
                placeholder="Description"
                onChange={(e) => setLocalDescription(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                  nightMode
                ? "bg-gray-700 text-white border-gray-600"
                : "text-gray-700"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={localDate}
                onChange={(e) => setLocalDate(e.target.value)}
                required
                className={`${nightMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700'} border p-2 rounded w-full`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="tags">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
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
                          className="ml-2 text-white"
                          onClick={() =>
                            setSelectedTags(selectedTags.filter((t) => t._id !== tag._id))
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
                  className={`${nightMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-700'} shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline`}
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <svg
                    className={`${nightMode ? 'text-white' : 'text-gray-700'} fill-current h-4 w-4`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
            </div>
            <button
              className={`${nightMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-700'} text-white font-bold py-2 px-4 mr-3 mb-3 rounded focus:outline-none focus:shadow-outline flex items-center`}
              type="button"
              onClick={handleLTAOpenDialog}
            >
              <FaPlus className="mr-2" /> <span>Public Transport</span>
            </button>
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className={`${nightMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-700'} font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${nightMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <LTADialog 
        open={isLTADialogOpen} 
        onClose={handleLTACloseDialog} 
        onSubmit={handleLTASubmitDialog}
        nightMode={nightMode}
      />
    </>
  );
};

export default EditFinanceModal;
