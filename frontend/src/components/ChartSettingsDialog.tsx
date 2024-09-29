import React from "react";
import { SketchPicker } from "react-color";

interface ChartSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  onChangeComplete: (color: { hex: string; thickness: number }) => void; // Adjust type for onChangeComplete
  selectedColor: string;
  lineThickness: number;
  startDate: string | undefined;
  endDate: string | undefined;
  onDateChange: (value: string | undefined) => void;
  numPeriods: number;
  dateType: "months" | "weeks";
  onNumPeriodsChange: (value: number) => void;
  onDateTypeChange: (value: "months" | "weeks") => void;
  onResetToDefault: () => void; // Add a new prop for resetting to default
  includeFuture: boolean;
  onIncludeFutureChange: (include: boolean) => void;
}

const ChartSettingsDialog: React.FC<ChartSettingsDialogProps> = ({
  open,
  onClose,
  onChangeComplete,
  selectedColor,
  lineThickness,
  startDate,
  endDate,
  onDateChange,
  numPeriods,
  dateType,
  onNumPeriodsChange,
  onDateTypeChange,
  onResetToDefault, // Destructure the new prop
  includeFuture,
  onIncludeFutureChange,
}) => {
  if (!open) return null;

  const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const thickness = parseFloat(e.target.value); // Ensure it's a number
    onChangeComplete({ hex: selectedColor, thickness });
  };

  const handleColorChange = (color: any) => {
    onChangeComplete({ hex: color.hex, thickness: lineThickness });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value || undefined);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value || undefined);
  };

  const handleNumPeriodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNumPeriodsChange(Number(e.target.value));
  };

  const handleDateTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDateTypeChange(e.target.value as "months" | "weeks");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Chart Settings</h2>

        {/* Scrollable Content Wrapper */}
        <div className="max-h-[60vh] overflow-y-auto pr-5 mb-5 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 rounded">
          {/* Color Picker */}
          <div className="mb-4">
            <label className="block text-m font-semibold text-gray-700 mb-2">
              Select Line Color:
            </label>
            <SketchPicker
              color={selectedColor}
              onChangeComplete={handleColorChange}
              width="95%"
            />
          </div>

          {/* Line Thickness */}
          <div className="mb-4">
            <label className="block text-m font-semibold text-gray-700 mb-2">
              Line Thickness:
            </label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={lineThickness}
              onChange={handleThicknessChange}
              min={1}
              max={10}
            />
          </div>

          {/* Date Range */}
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-m font-semibold text-gray-700 mb-2">
                Start Date:
              </label>
              <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={startDate || ""}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-m font-semibold text-gray-700 mb-2">
                End Date:
              </label>
              <input
                type="date"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={endDate || ""}
                onChange={handleEndDateChange}
              />
            </div>
          </div>

          {/* Period Selector */}
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-m font-semibold text-gray-700 mb-2">
                Period:
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={numPeriods}
                onChange={handleNumPeriodsChange}
                min={1}
                max={24}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-m font-semibold text-gray-700 mb-2">
                Period Type:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dateType}
                onChange={handleDateTypeChange}
              >
                <option value="months">Months</option>
                <option value="weeks">Weeks</option>
              </select>
            </div>
          </div>

          {/* Include Future */}
          <div className="mb-4 flex items-center">
            <label className="text-m font-semibold text-gray-700 mr-2">
              Include Future Items:
            </label>
            <input
              type="checkbox"
              className="shadow form-checkbox h-5 w-5 text-gray-600 border rounded focus:ring-blue-500 focus:ring-opacity-50"
              checked={includeFuture}
              onChange={(e) => onIncludeFutureChange(e.target.checked)}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onResetToDefault}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartSettingsDialog;
