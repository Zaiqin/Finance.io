import React, { useState, useEffect } from "react";
import ChartComponent from "./Chart"; // Import the ChartComponent
import { format } from "date-fns";
import ConfirmationDialog from "./ConfirmationDialog"; // Import the ConfirmationDialog
import EditFinanceModal from "./EditFinanceModal"; // Import the new modal component
import { FaTrash, FaChartLine } from "react-icons/fa";
import { MdEdit, MdPostAdd } from "react-icons/md";
import { BsTable } from "react-icons/bs";

interface Finance {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

const FinanceList: React.FC<{
  finances: Finance[];
  updateFinance: (id: string, finance: any) => void;
  deleteFinance: (id: string) => void;
  categories: string[];
  handleOpenFinanceForm: () => void; // Add a new prop for opening the finance form
}> = ({
  finances,
  updateFinance,
  deleteFinance,
  categories,
  handleOpenFinanceForm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for confirmation dialog
  const [currentFinance, setCurrentFinance] = useState<Finance | null>(null);
  const [showChart, setShowChart] = useState(true); // State to toggle between chart and table
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page

  // Update itemsPerPage based on available screen height
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const headerHeight = 150; // Estimated space for headers/buttons
      const rowHeight = 120; // Estimated row height for each date entry
      const availableHeight = window.innerHeight * 0.6 - headerHeight;
      const newItemsPerPage = Math.max(
        Math.floor(availableHeight / rowHeight),
        1
      );
      setItemsPerPage(newItemsPerPage);
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);

    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  const openModal = (id: string) => {
    const selectedFinance = finances.find((finance) => finance._id === id);
    if (selectedFinance) {
      setCurrentFinance(selectedFinance);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFinance(null);
  };

  const handleUpdate = (updatedFinance: Finance) => {
    console.log("asdf");
    console.log(updatedFinance);
    if (currentFinance) {
      updateFinance(currentFinance._id, updatedFinance);
      closeModal();
    }
  };

  const handleDelete = (id: string) => {
    deleteFinance(id);
    setIsConfirmOpen(false); // Close the confirmation dialog
  };

  // Sort the finances by date in descending order
  const sortedFinances = [...finances].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    // (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() causes graph to be reversed
  );

  const groupedFinances = sortedFinances.reduce((acc, finance) => {
    const date = finance.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(finance);
    return acc;
  }, {} as { [key: string]: Finance[] });

  const chartData = {
    labels: Object.keys(groupedFinances),
    datasets: [
      {
        label: "Total Expenses",
        data: Object.keys(groupedFinances).map((date) =>
          groupedFinances[date].reduce(
            (sum, finance) => sum + finance.amount,
            0
          )
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Calculate the data for the current page
  const dates = Object.keys(groupedFinances);
  const totalPages = Math.ceil(dates.length / itemsPerPage);
  const currentDates = dates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Chart and table toggle */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 flex-grow">
          Dashboard
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            onClick={() => setShowChart(!showChart)}
          >
            {showChart ? (
              <>
                <BsTable className="mr-2" /> Table
              </>
            ) : (
              <>
                <FaChartLine className="mr-2" /> Chart
              </>
            )}
          </button>
          <div className="flex">
            <button
              type="button"
              onClick={handleOpenFinanceForm}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              <MdPostAdd className="mr-2 text-2xl" />{" "}
              {/* Increase the icon size here */}
              <span>New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart or Table View */}
      {showChart ? (
        <div className="mb-3">
          <ChartComponent data={chartData} groupedFinances={groupedFinances} />
        </div>
      ) : (
        <>
          <div className="overflow-y-auto max-h-[60vh] pr-6">
            {" "}
            {/* Limit the height and enable scrolling */}
            {currentDates.map((date) => (
              <div key={date} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {format(new Date(date), "d MMM yyyy")}
                </h3>
                <div className="overflow-x-auto shadow-md rounded-md">
                  <table className="min-w-full bg-white rounded-lg">
                    <thead className="text-left">
                      <tr>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600 font-bold text-m rounded-tl-lg">
                          Category
                        </th>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600 font-bold text-m">
                          Amount
                        </th>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600 font-bold text-m">
                          Description
                        </th>
                        <th className="py-2 px-4 bg-gray-200 text-gray-600 font-bold text-m rounded-tr-lg text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedFinances[date].map((finance, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4 text-gray-700">
                            {finance.category}
                          </td>
                          <td className="py-2 px-4 text-gray-700">
                            ${finance.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </td>
                          <td className="py-2 px-4 text-gray-700">
                            {finance.description}
                          </td>
                          <td className="py-2 px-4 text-gray-700 text-center">
                            <div className="flex justify-center">
                              <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 ml-1 rounded focus:outline-none focus:shadow-outline shadow-md rounded-md"
                                onClick={() => openModal(finance._id)}
                              >
                                <MdEdit />
                              </button>
                              <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline ml-2 shadow-md rounded-md"
                                onClick={() => {
                                  setCurrentFinance(finance);
                                  setIsConfirmOpen(true); // Open the confirmation dialog
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t bg-gray-100">
                        <td className="py-2 px-4 text-gray-700 font-bold">
                          Total
                        </td>
                        <td className="py-2 px-4 text-gray-700 font-bold">
                          $
                            {groupedFinances[date]
                            .reduce((sum, finance) => sum + finance.amount, 0)
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                currentPage === 1
                  ? "bg-gray-300 text-white"
                  : "bg-gray-500 hover:bg-gray-700 text-white"
              }`}
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                currentPage === totalPages
                  ? "bg-gray-300 text-white"
                  : "bg-gray-500 hover:bg-gray-700 text-white"
              }`}
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal for editing finance */}
      {isModalOpen && currentFinance && (
        <EditFinanceModal
          finance={currentFinance}
          onUpdate={handleUpdate}
          onClose={closeModal}
          categories={categories}
        />
      )}

      {/* Confirmation dialog for deleting finance */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        message={`Are you sure you want to delete this item?`}
        onConfirm={() => {
          if (currentFinance) {
            handleDelete(currentFinance._id);
          }
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default FinanceList;
