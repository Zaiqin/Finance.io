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
  onDateStartChange: (value: string | undefined) => void;
  onDateEndChange: (value: string | undefined) => void;
  numPeriods: number;
  dateType: "months" | "weeks";
  onNumPeriodsChange: (value: number) => void;
  onDateTypeChange: (value: "months" | "weeks") => void;
  onResetToDefault: () => void; // Add a new prop for resetting to default
  includeFuture: boolean;
  onIncludeFutureChange: (include: boolean) => void;
  filterType: "period" | "range"; // Add filterType prop
  onFilterTypeChange: (type: "period" | "range") => void; // Add handler for filterType
  nightMode: boolean;
}

const ChartSettingsDialog: React.FC<ChartSettingsDialogProps> = ({
  open,
  onClose,
  onChangeComplete,
  selectedColor,
  lineThickness,
  startDate,
  endDate,
  onDateStartChange,
  onDateEndChange,
  numPeriods,
  dateType,
  onNumPeriodsChange,
  onDateTypeChange,
  onResetToDefault, // Destructure the new prop
  includeFuture,
  onIncludeFutureChange,
  filterType,
  onFilterTypeChange,
  nightMode,
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
    onDateStartChange(e.target.value || undefined);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateEndChange(e.target.value || undefined);
  };

  const handleNumPeriodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNumPeriodsChange(Number(e.target.value));
  };

  const handleDateTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDateTypeChange(e.target.value as "months" | "weeks");
  };

  const handleFilterTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterTypeChange(e.target.value as "period" | "range");
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        nightMode ? "bg-gray-900" : "bg-black"
      } bg-opacity-50 z-10`}
    >
      <div
        className={`${
          nightMode ? "bg-gray-800 text-white" : "bg-white text-black"
        } p-6 rounded-lg shadow-md max-w-lg w-full m-6`}
      >
        <h2 className="text-2xl font-bold mb-4">Chart Settings</h2>

        {/* Scrollable Content Wrapper */}
        <div
          className={`max-h-[60vh] overflow-y-auto pr-5 mb-5 scrollbar-thin ${
            nightMode
              ? "scrollbar-thumb-gray-700 scrollbar-track-gray-600"
              : "scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          } rounded`}
        >
          {/* Color Picker */}
          <div className="mb-4">
            <label className="block text-m font-semibold mb-2">
              Select Line Color:
            </label>
            <div
              className={`p-2 rounded ${
                nightMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              {nightMode ? (
                <SketchPicker
                color={selectedColor}
                onChangeComplete={handleColorChange}
                width="95%"
                styles={{
                  default: {
                    picker: {
                      background: nightMode ? "#2d3748" : "#fff",
                      color: "#000",
                    },
                    controls: {
                      background: nightMode ? "#2d3748" : "#fff",
                      color: "#000",
                    }
                  },
                }}
              />
              ):( 
                <SketchPicker
                color={selectedColor}
                onChangeComplete={handleColorChange}
                width="95%"
                styles={{
                  default: {
                    picker: {
                      background: nightMode ? "#2d3748" : "#fff",
                      color: "#000",
                    },
                    controls: {
                      background: nightMode ? "#2d3748" : "#fff",
                      color: "#000",
                    }
                  },
                }}
              />
              )}
            </div>
          </div>

          {/* Line Thickness */}
          <div className="mb-4">
            <label className="block text-m font-semibold mb-2">
              Line Thickness:
            </label>
            <input
              type="number"
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                nightMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "text-gray-700"
              }`}
              value={lineThickness}
              onChange={handleThicknessChange}
              min={1}
              max={10}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="filterType"
              className="block text-m font-semibold mb-2"
            >
              Filter By:
            </label>
            <div className="relative">
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                  nightMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "text-gray-700"
                }`}
                id="filterType"
                value={filterType}
                onChange={handleFilterTypeChange}
              >
                <option value="period">Period</option>
                <option value="range">Date Range</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className={`fill-current h-4 w-4 ${
                    nightMode ? "text-white" : "text-gray-700"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {filterType === "period" ? (
            <>
              {/* Period Selector */}
              <div className="mb-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-m font-semibold mb-2">
                    Period:
                  </label>
                  <input
                    type="number"
                    className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                      nightMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "text-gray-700"
                    }`}
                    value={numPeriods}
                    onChange={handleNumPeriodsChange}
                    min={1}
                    max={24}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-m font-semibold mb-2">
                    Period Type:
                  </label>
                  <div className="relative">
                    <select
                      className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                        nightMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "text-gray-700"
                      }`}
                      value={dateType}
                      onChange={handleDateTypeChange}
                    >
                      <option value="months">Months</option>
                      <option value="weeks">Weeks</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <svg
                        className={`fill-current h-4 w-4 ${
                          nightMode ? "text-white" : "text-gray-700"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label className="block text-m font-semibold mb-2">
                  Start Date:
                </label>
                <input
                  type="date"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                    nightMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "text-gray-700"
                  }`}
                  value={startDate || ""}
                  onChange={handleStartDateChange}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-m font-semibold mb-2">
                  End Date:
                </label>
                <input
                  type="date"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                    nightMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "text-gray-700"
                  }`}
                  value={endDate || ""}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
          )}

          {/* Include Future */}
          <div className="mb-4 flex items-center">
            <label className="text-m font-semibold mr-2">
              Include Future Items:
            </label>
            <input
              type="checkbox"
              className={`shadow form-checkbox h-5 w-5 ${
                nightMode ? "text-gray-400 border-gray-600" : "text-gray-600"
              } rounded focus:ring-blue-500 focus:ring-opacity-50`}
              checked={includeFuture}
              onChange={(e) => onIncludeFutureChange(e.target.checked)}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onResetToDefault}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartSettingsDialog;
