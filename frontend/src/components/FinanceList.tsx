import React, { useState } from "react";
import ChartComponent from "./Chart"; // Import the ChartComponent
import { format } from "date-fns";
import ConfirmationDialog from "./ConfirmationDialog"; // Import the ConfirmationDialog
import EditFinanceModal from './EditFinanceModal'; // Import the new modal component

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
}> = ({ finances, updateFinance, deleteFinance, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for confirmation dialog
  const [currentFinance, setCurrentFinance] = useState<Finance | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [showChart, setShowChart] = useState(true); // State to toggle between chart and table
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 5; // Number of items per page

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
    setCurrentIndex(null);
  };

  const handleUpdate = (updatedFinance: Finance) => {
    if (currentIndex !== null && currentFinance) {
      updateFinance(currentFinance._id, updatedFinance);
      closeModal();
    }
  };

  const handleDelete = (id: string) => {
    deleteFinance(id);
    setIsConfirmOpen(false); // Close the confirmation dialog
  };

  // Sort the finances by date in ascending order
  const sortedFinances = [...finances].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
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
          groupedFinances[date].reduce((sum, finance) => sum + finance.amount, 0)
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
        <h2 className="text-2xl font-semibold text-gray-800">Finance Overview</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => setShowChart(!showChart)}
        >
          {showChart ? "Show Table" : "Show Chart"}
        </button>
      </div>

      {/* Chart or Table View */}
      {showChart ? (
        <div className="mb-6">
          <ChartComponent data={chartData} groupedFinances={groupedFinances} />
        </div>
      ) : (
        <>
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
                        <td className="py-2 px-4 text-gray-700">{finance.category}</td>
                        <td className="py-2 px-4 text-gray-700">${finance.amount.toFixed(2)}</td>
                        <td className="py-2 px-4 text-gray-700">{finance.description}</td>
                        <td className="py-2 px-4 text-gray-700 text-center">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline shadow-md rounded-md"
                            onClick={() => openModal(finance._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2 shadow-md rounded-md"
                            onClick={() => {
                              setCurrentFinance(finance);
                              setIsConfirmOpen(true); // Open the confirmation dialog
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-100">
                      <td className="py-2 px-4 text-gray-700 font-bold">Total</td>
                      <td className="py-2 px-4 text-gray-700 font-bold">
                        ${groupedFinances[date].reduce((sum, finance) => sum + finance.amount, 0).toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
            <div className="flex justify-between items-center">
            <button
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
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