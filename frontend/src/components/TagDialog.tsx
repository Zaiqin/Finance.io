import React, { useState, useEffect } from "react";
import { Tag } from "../interfaces/interface";

// Function to calculate contrast color
const getContrastYIQ = (hexcolor: string) => {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tag: Tag) => void;
  onDelete: (id: string) => void;
  existingTags: Tag[];
  addTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  updateTag: (id: string, updatedTag: Tag) => void;
}

const TagDialog: React.FC<TagDialogProps> = ({
  open,
  onClose,
  onSubmit,
  onDelete,
  existingTags,
  addTag,
  deleteTag,
  updateTag,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedTag) {
      setName(selectedTag.name);
      setColor(selectedTag.color);
    } else {
      setName("");
      setColor("#000000");
    }
  }, [selectedTag]);

  const checkExistingTag = (name: string) => {
    if (
      existingTags.some(
        (tag) =>
          tag.name.toLowerCase() === name.toLowerCase() &&
          (!selectedTag ||
            selectedTag.name.toLowerCase() !== name.toLowerCase())
      )
    ) {
      setError("A tag with this name already exists.");
      return;
    }
    setError("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (error != "") return;
    if (selectedTag) {
      onSubmit({ ...selectedTag, name, color });
      updateTag(selectedTag._id!, { ...selectedTag, name, color });
    } else {
      onSubmit({
        name,
        color,
        _id: undefined,
      });
      addTag({ name, color, _id: undefined });
    }
    setSelectedTag(null);
    setName("");
    setColor("#000000");
  };

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
  };

  const handleDelete = (tag: Tag) => {
    if (tag._id) {
      onDelete(tag._id);
      setSelectedTag(null);
      deleteTag(tag._id);
      setName("");
      setColor("#000000");
    }
  };

  const handleCancelEdit = () => {
    setSelectedTag(null);
    setName("");
    setColor("#000000");
    setError("");
  };

  const handleOnClose = () => {
    setSelectedTag(null);
    setName("");
    setColor("#000000");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full sm:w-1/3 min-w-[400px] m-6">
        <h2 className="text-xl font-bold mb-4">
          {selectedTag ? "Edit Tag" : "Add Tag"}
        </h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Tag Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              value={name}
              required
              placeholder="Tag Name"
              maxLength={20}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  setName(e.target.value);
                  checkExistingTag(e.target.value);
                }
              }}
            />
            {error && (
              <p className="text-red-500 text-sm italic mt-1">{error}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="color"
            >
              Tag Color
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-7"
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2 items-start">
            <div className="flex space-x-2">
              {/* Group 2: Close and Add/Update */}
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleOnClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {selectedTag ? "Update" : "Add"}
              </button>
              {selectedTag && (
                <button
                  type="button"
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Existing Tags</h3>
          <ul className="flex flex-col gap-2 overflow-y-auto max-h-[30vh] pr-2">
            {existingTags.map((tag) => {
              const textColor = getContrastYIQ(tag.color);
              return (
                <li key={tag._id} className="flex items-center justify-between">
                  <span
                    className="inline-block px-2 py-1 text-white shadow-md rounded-md"
                    style={{
                      backgroundColor: tag.color,
                      color: textColor,
                      borderRadius: "0.5rem",
                    }}
                  >
                    {tag.name}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleEdit(tag)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleDelete(tag)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TagDialog;
