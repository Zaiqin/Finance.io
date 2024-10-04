import React, { useState } from "react";
import { ChartFinance, Tag } from "../interfaces/interface";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SummaryComponentProps {
  finances: { [key: string]: ChartFinance[] };
  filterType: "period" | "range";
  startDate?: string;
  endDate?: string;
  startDatePeriod?: Date;
  endDatePeriod?: Date;
}

const SummaryComponent: React.FC<SummaryComponentProps> = ({
  finances,
  filterType,
  startDate,
  endDate,
  startDatePeriod,
  endDatePeriod,
}) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  console.log(finances);

  // Flatten the finances data
  const allFinances = Object.values(finances).flat();

  // Filter finances based on filterType
  const filteredByDateFinances = allFinances.filter((finance) => {
    const financeDate = new Date(finance.date);
    if (filterType === "period" && startDatePeriod && endDatePeriod) {
      return financeDate >= startDatePeriod && financeDate <= endDatePeriod;
    } else if (filterType === "range" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return financeDate >= start && financeDate <= end;
    }
    return true;
  });

  // Filter finances based on selected tags
  const filteredFinances =
    selectedTags.length > 0
      ? filteredByDateFinances.filter(
          (finance) =>
            finance.tags &&
            finance.tags.some((tag) =>
              selectedTags.some((selectedTag) => tag._id === selectedTag._id)
            )
        )
      : filteredByDateFinances;

  // Calculate total expenditure and number of transactions
  const totalExpenditure = filteredFinances.reduce(
    (sum: number, finance: ChartFinance) => sum + finance.amount,
    0
  );
  const numberOfTransactions = filteredFinances.length;

  // Calculate spending per category
  const spendingPerCategory = filteredFinances.reduce(
    (acc: { [key: string]: number }, finance: ChartFinance) => {
      acc[finance.category] = (acc[finance.category] || 0) + finance.amount;
      return acc;
    },
    {}
  );

  // Calculate average spending
  const averageSpending = numberOfTransactions
    ? totalExpenditure / numberOfTransactions
    : 0;

  // Get unique tags
  const uniqueTags = Array.from(
    new Set(
      allFinances.flatMap((finance) => finance.tags?.map((tag) => tag._id))
    )
  ).map((id) =>
    allFinances
      .flatMap((finance) => finance.tags)
      .find((tag) => tag?._id === id)
  );

  // Calculate highest and lowest spending transactions
  const highestSpending = Math.max(
    ...filteredFinances.map((finance) => finance.amount)
  );
  const lowestSpending = Math.min(
    ...filteredFinances.map((finance) => finance.amount)
  );

  const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = uniqueTags.find(
      (tag) => tag && tag._id === event.target.value
    );
    if (
      selectedTag &&
      !selectedTags.some((tag) => tag._id === selectedTag._id)
    ) {
      setSelectedTags([...selectedTags, selectedTag]);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag._id !== tagId));
  };

  // Prepare data for the pie chart
  const pieChartData = {
    labels: Object.keys(spendingPerCategory),
    datasets: [
      {
        data: Object.values(spendingPerCategory),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const data = tooltipItem.dataset.data;
            const currentValue = data[tooltipItem.dataIndex];
            const percentage = ((currentValue / totalExpenditure) * 100)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return `${tooltipItem.label}: $${currentValue
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${percentage}%)`;
          },
        },
      },
    },
  };

  const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  return (
    <div className="mt-10 pl-2 pr-2 bg-white">
      <hr className="mb-4" />
      <h3 className="text-2xl mb-3 font-semibold text-gray-800 text-center">
        Summary
      </h3>
      <div className="mb-6">
        <label className="text-gray-700 font-medium">Filter by Tag(s):</label>
        <div
          className={`flex flex-wrap ${selectedTags.length > 0 ? "mt-2" : ""}`}
        >
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
                  onClick={() => tag._id && removeTag(tag._id)}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
        <div className="relative">
          <select
            className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value=""
            onChange={handleTagChange}
          >
            <option value="" disabled>
              -- Select tag(s) --
            </option>
            {uniqueTags.map((tag) =>
              tag ? (
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
              ) : null
            )}
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg text-gray-700 font-semibold">
            Total Expenditure:
          </p>
          <p className="text-xl text-gray-900 font-bold">
            ${totalExpenditure.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg text-gray-700 font-semibold">
            Average Spending:
          </p>
          <p className="text-xl text-gray-900 font-bold">
            ${averageSpending.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg text-gray-700 font-semibold">
            Highest Spending Transaction:
          </p>
          <p className="text-xl text-gray-900 font-bold">
            ${highestSpending.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg text-gray-700 font-semibold">
            Lowest Spending Transaction:
          </p>
          <p className="text-xl text-gray-900 font-bold">
            ${lowestSpending.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4">
          Spending Per Category:
        </h4>

        <div className="flex flex-col md:flex-row justify-center md:items-start">
          {/* Table Section */}
          <div className="md:w-1/2">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                    Category
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                    Amount
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(spendingPerCategory).map(
                  ([category, amount]) => {
                    const percentage = (
                      (amount / totalExpenditure) *
                      100
                    ).toFixed(2);
                    return (
                      <tr key={category}>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {category}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          $
                          {amount
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* Pie Chart Section */}
          <div className="mt-6 md:mt-0 md:w-1/2 md:ml-6 flex justify-center">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryComponent;
