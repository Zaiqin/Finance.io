import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  date: string | undefined;
  text: string | undefined;
  onConfirm: () => void;
  onCancel: () => void;
  nightMode: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  text,
  date,
  nightMode
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${nightMode ? 'bg-gray-900 bg-opacity-75' : 'bg-black bg-opacity-50'}`}>
      <div className={`${nightMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg w-full max-w-md m-6`}>
      <h2 className={`${nightMode ? 'text-gray-200' : 'text-gray-800'} text-xl font-semibold mb-4`}>Confirmation</h2>
      <p className={`${nightMode ? 'text-white' : 'text-gray-700'} mb-2`}>{message}</p>
      {text && <p className={`${nightMode ? 'text-white' : 'text-gray-700'} font-bold mb-4`}>{text} {date ? ' - ' + new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    }) : ''}</p>}
      <div className="flex justify-between">
        <button
        type="button"
        onClick={onCancel}
        className={`${nightMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
        Cancel
        </button>
        <button
        type="button"
        onClick={onConfirm}
        className={`${nightMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
        Delete
        </button>
      </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
