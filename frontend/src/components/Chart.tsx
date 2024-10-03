import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import ChartSettingsDialog from "./ChartSettingsDialog"; // Import the dialog
import { FaChevronLeft, FaChevronRight, FaCog } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  GridLineOptions,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom"; // Import zoom plugin
import annotationPlugin from "chartjs-plugin-annotation";
import { ChartFinance } from "../interfaces/interface";

// Register the necessary elements and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  zoomPlugin, // Register zoom plugin
  annotationPlugin
);

interface ChartProps {
  data: {
    labels: string[]; // Labels will hold the dates
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  groupedFinances: { [key: string]: ChartFinance[] }; // Pass grouped finances
}

const formatLabel = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const formatLabelShort = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
};

const getWeekOfMonth = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = startOfMonth.getDay();
  const adjustedDate = date.getDate() + dayOfWeek;
  return Math.ceil(adjustedDate / 7);
};

const ChartComponent: React.FC<ChartProps> = ({ data, groupedFinances }) => {
  const [lineColor, setLineColor] = useState<string>("#3b82f6");
  const [lineThickness, setLineThickness] = useState<number>(3); // Added state for line thickness
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [startDatePeriod, setStartDatePeriod] = useState<Date>();
  const [endDatePeriod, setEndDatePeriod] = useState<Date>();
  const [currentDate, setCurrentDate] = useState(new Date()); // Track the current date
  const [numPeriods, setNumPeriods] = useState<number>(1); // State for number of periods
  const [dateType, setDateType] = useState<"months" | "weeks">("months"); // State for date type
  const [includeFuture, setIncludeFuture] = useState<boolean>(false); // State for including future finances
  const [filterType, setFilterType] = useState<"period" | "range">("period"); // New state for filter type
  const [dateEnd, setDateEnd] = useState<Date>();

  const handleColorChange = (color: { hex: string; thickness: number }) => {
    setLineColor(color.hex);
    setLineThickness(color.thickness); // Update line thickness
  };

  const resetTime = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const filterDataByPeriods = () => {
    let end = resetTime(currentDate); // Normalize currentDate to remove time component
    let start: Date;

    if (dateType === "months") {
      // Calculate start and end dates for the selected months
      start = new Date(end.getFullYear(), end.getMonth() - (numPeriods - 1), 1); // Start of the first month in the range
      end = new Date(end.getFullYear(), end.getMonth() + 1, 0); // End of the last month in the range
    } else {
      // Calculate start and end dates for the selected weeks
      const dayOfWeek = end.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const daysSinceStartOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday as the start of the week

      start = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate() - (daysSinceStartOfWeek + (numPeriods - 1) * 7)
      ); // Start of the first week in the range
      end = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate() + (6 - daysSinceStartOfWeek)
      ); // End of the current week
    }

    // If includeFuture is false, adjust the start date to prevent selecting future dates
    if (!includeFuture) {
      const today = resetTime(new Date());
      // Only allow dates up to today
      if (start > today) {
        start = today;
      }
      if (end > today) {
        end = today;
      }
    }

    const filteredLabels = data.labels.filter((label) => {
      const date = resetTime(new Date(label)); // Normalize label date to remove time component
      return date >= start && date <= end;
    });

    //console.log(start.toLocaleDateString(), end.toLocaleDateString());
    setDateEnd(end);
    setStartDatePeriod(start);
    setEndDatePeriod(end);

    const filteredDatasets = data.datasets.map((dataset) => {
      const filteredData = dataset.data.filter((_, index) => {
        const date = resetTime(new Date(data.labels[index])); // Normalize label date to remove time component
        return date >= start && date <= end;
      });
      return { ...dataset, data: filteredData };
    });

    //console.log(filteredDatasets);

    return { labels: filteredLabels, datasets: filteredDatasets };
  };

  // Function to handle previous periods
  const handlePrevious = () => {
    setCurrentDate((prevDate) => {
      let newDate;

      if (dateType === "months") {
        newDate = new Date(
          prevDate.getFullYear(),
          prevDate.getMonth() - numPeriods,
          1
        ); // Move back by numPeriods (months)
      } else {
        newDate = new Date(
          prevDate.getFullYear(),
          prevDate.getMonth(),
          prevDate.getDate() - numPeriods * 7
        ); // Move back by numPeriods (weeks)
      }

      if (includeFuture) {
        const maxDate = new Date(
          Math.max(...data.labels.map((label) => new Date(label).getTime()))
        );
        // Ensure newDate doesn't go beyond the maximum date in the future
        if (newDate > maxDate) {
          return maxDate;
        }
      }

      return newDate;
    });
  };

  // Function to handle next periods
  const handleNext = () => {
    setCurrentDate((prevDate) => {
      let newDate;

      if (dateType === "months") {
        newDate = new Date(
          prevDate.getFullYear(),
          prevDate.getMonth() + numPeriods,
          1
        ); // Move forward by numPeriods (months)
      } else {
        newDate = new Date(
          prevDate.getFullYear(),
          prevDate.getMonth(),
          prevDate.getDate() + numPeriods * 7
        ); // Move forward by numPeriods (weeks)
      }

      if (!includeFuture) {
        const today = new Date();
        if (newDate > today) {
          return today; // Bring to the current date if newDate exceeds today
        }
      }

      return newDate;
    });
  };

  const handleTodayClick = () => {
    const today = new Date();
    let startOfPeriod;

    if (dateType === "weeks") {
      // Calculate the start of the week (assuming week starts on Sunday)
      const dayOfWeek = today.getDay();
      startOfPeriod = new Date(today);
      startOfPeriod.setDate(today.getDate() - dayOfWeek);
    } else {
      // Calculate the start of the month
      startOfPeriod = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    setStartDate(startOfPeriod.toLocaleDateString());
    setEndDate(today.toLocaleDateString());
    setStartDatePeriod(startOfPeriod);
    setEndDatePeriod(today);
    setCurrentDate(startOfPeriod);
    setNumPeriods(1); // Reset the number of periods to 1
  };

  // Ensure currentDate is set correctly when the component mounts
  React.useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
  }, []);

  const filterDataByDateRange = () => {
    if (!startDate || !endDate) return data;

    const start = resetTime(new Date(startDate)); // Normalize startDate
    const end = resetTime(new Date(endDate)); // Normalize endDate

    const filteredLabels = data.labels.filter((label) => {
      const date = resetTime(new Date(label)); // Normalize label date
      return date >= start && date <= end;
    });

    const filteredDatasets = data.datasets.map((dataset) => {
      const filteredData = dataset.data.filter((_, index) => {
        const date = resetTime(new Date(data.labels[index])); // Normalize label date for datasets
        return date >= start && date <= end;
      });
      return { ...dataset, data: filteredData };
    });

    return { labels: filteredLabels, datasets: filteredDatasets };
  };

  const filteredData = useMemo(() => {
    return filterType === "period"
      ? filterDataByPeriods()
      : filterDataByDateRange();
  }, [
    data,
    groupedFinances,
    filterType,
    startDate,
    endDate,
    numPeriods,
    includeFuture,
    currentDate,
    dateType,
  ]);

  const handlePointClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const { datasetIndex, index } = elements[0];
      const label = filteredData.labels[index];
      const value = filteredData.datasets[datasetIndex].data[index];
      const finances = groupedFinances[label] || [];
      console.log(
        `Clicked on point: ${label} - $${value}\nDetails:\n${finances
          .map(
            (finance) =>
              `${finance.category}: $${finance.amount.toFixed(2)} (${
                finance.description
              })`
          )
          .join("\n")}`
      );
    }
  };

  const resetToDefault = () => {
    setLineColor("#3b82f6");
    setLineThickness(3);
    setNumPeriods(1);
    setDateType("months");
    setIncludeFuture(false);
    setFilterType("period");

    handleTodayClick();
  };

  const options = {
    scales: {
      x: {
        type: "category" as const,
        grid: {
          drawBorder: true,
          borderWidth: 2 as const,
        } as Partial<GridLineOptions>,
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          callback: (value: string | number) => {
            const date = formatLabelShort(filteredData.labels[+value]); // Format label using the filtered date
            return date;
          },
        },
      },
      y: {
        type: "linear" as const,
        grid: {
          drawBorder: true,
          borderWidth: 2 as const,
        } as Partial<GridLineOptions>,
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          callback: (value: string | number) => {
            return `$${(+value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`; // Format value as 2dp currency
          },
        },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const, // Enable panning along the x-axis
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zooming via mouse wheel
          },
          drag: {
            enabled: true, // Enable drag-to-zoom
          },
          mode: "x" as const, // Zoom along the x-axis
        },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any[]) => {
            const date = formatLabel(tooltipItems[0].label); // Get the hovered date
            return date; // Display the date as the title
          },
          label: (tooltipItem: any) => {
            const date = tooltipItem.label; // Get the date from the tooltip item
            const total = tooltipItem.raw; // Get the total amount
            const finances = groupedFinances[date] || []; // Get finances for the date
        
            // Create an array of labels to display in the tooltip
            const labels = [`Total: $${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`];
            const allTags: string[] = [];
        
            finances.forEach((finance) => {
              const description = finance.description ? ` (${finance.description})` : "";
              const tags = finance.tags && finance.tags.length > 0
                ? ` [${finance.tags.map(tag => tag.name).join(", ")}]`
                : "";
              
              // Push the formatted finance details
              labels.push(
                `• ${finance.category}: $${finance.amount
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${description}${tags}`
              );
        
              if (finance.tags) {
                allTags.push(...finance.tags.map(tag => tag.name));
              }
            });
        
            return labels; // Return the array of labels
          },
        },
        
      },
      annotation: {
        annotations: {
          line1: {
            type: "line" as const, // Explicitly specify the type as 'line'
            yMin: 0,
            yMax: 0,
            borderColor: "red",
            borderWidth: 1,
            borderDash: [5, 5],
          },
        },
      },
    },
    onClick: handlePointClick, // Add the onClick handler
  };

  // Update the datasets with the color and thickness props
  const updatedData = {
    ...filteredData,
    datasets: filteredData.datasets.map((dataset) => ({
      ...dataset,
      borderColor: lineColor,
      borderWidth: lineThickness, // Use the line thickness from state
    })),
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-3 font-semibold text-gray-800 text-center">
        Expenditure Chart
      </h2>
      <div className="mb-2 flex items-center justify-between">
        {filterType === "period" && (
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            type="button"
            onClick={handlePrevious} // Call previous handler
          >
            <FaChevronLeft />
          </button>
        )}
        {filterType === "period" ? (
          <>
            {startDatePeriod && endDatePeriod && (
              <>
                <h2 className="items-center text-center">
                  {new Date(startDatePeriod).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(endDatePeriod).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                  <br />
                  {dateType === "months"
                    ? `(${startDatePeriod.toLocaleString("default", {
                        month: "short",
                      })} - ${endDatePeriod.toLocaleString("default", {
                        month: "short",
                      })})`
                    : `(${startDatePeriod.toLocaleString("default", {
                        month: "short",
                      })} W${getWeekOfMonth(
                        startDatePeriod
                      )} - ${endDatePeriod.toLocaleString("default", {
                        month: "short",
                      })} W${getWeekOfMonth(endDatePeriod)})`}
                </h2>
              </>
            )}
          </>
        ) : (
          <h2>
            Date Range:{" "}
            {startDate
              ? `${new Date(startDate).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })} - `
              : ""}
            {endDate
              ? `${new Date(endDate).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}`
              : ""}
          </h2>
        )}
        {filterType === "period" && (
          <button
            className={`${
              !includeFuture &&
              dateEnd?.toDateString() === new Date().toDateString()
                ? "bg-gray-300 opacity-50"
                : "bg-gray-500 hover:bg-gray-700"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center`}
            type="button"
            onClick={handleNext} // Call next handler
            disabled={
              !includeFuture &&
              dateEnd?.toDateString() === new Date().toDateString()
            }
          >
            <FaChevronRight />
          </button>
        )}
      </div>
      <Line
        data={updatedData}
        options={options}
        style={{ maxHeight: "40vh", overflowY: "auto" }}
      />

      {/* Chart Settings Dialog */}
      <ChartSettingsDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onChangeComplete={handleColorChange}
        selectedColor={lineColor}
        lineThickness={lineThickness}
        startDate={startDate}
        endDate={endDate}
        onDateStartChange={setStartDate}
        onDateEndChange={setEndDate}
        numPeriods={numPeriods}
        dateType={dateType}
        onNumPeriodsChange={setNumPeriods}
        onDateTypeChange={setDateType}
        onResetToDefault={resetToDefault}
        includeFuture={includeFuture} // Pass includeFuture to the dialog
        onIncludeFutureChange={setIncludeFuture} // Pass the setter function to the dialog
        filterType={filterType}
        onFilterTypeChange={setFilterType} // Add the filter type handler
      />
      <br />
      <div className="mb-2 flex items-center justify-between">
        {/* Left-aligned Chart Settings */}
        <div className="flex">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            type="button"
            onClick={() => setIsDialogOpen(true)}
          >
            <FaCog className="mr-2" /> <span>Settings</span>
          </button>
        </div>

        {/* Right-aligned group (Today and Reset) */}
        <div className="flex space-x-2">
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetToDefault}
          >
            Reset View
          </button>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleTodayClick}
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
