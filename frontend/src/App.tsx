import React, { useState, useEffect } from "react";
import FinanceForm from "./components/FinanceForm";
import FinanceList from "./components/FinanceList";
import TransportFees from "./components/TransportFees";
import SettingsDialog from "./components/SettingsDialog";

const App: React.FC = () => {
  const [finances, setFinances] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Travel",
    "Activity",
  ]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFinanceFormOpen, setIsFinanceFormOpen] = useState(false);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        console.log(`${process.env.REACT_APP_SERVER_URL}`);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/finances`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setFinances(data);
      } catch (error) {
        console.error("Error fetching finances:", error);
      }
    };
    fetchFinances();
  }, []);

  const addFinance = async (finance: any) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/finances`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finance),
        }
      );
      const newFinance = await response.json();
      setFinances([...finances, newFinance]);
    } catch (error) {
      console.error("Error adding finance:", error);
    }
  };

  const updateFinance = async (id: string, updatedFinance: any) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/finances/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFinance),
        }
      );
      const data = await response.json();
      setFinances((prev) =>
        prev.map((finance) => (finance._id === id ? data : finance))
      );
    } catch (error) {
      console.error("Error updating finance:", error);
    }
  };

  const deleteFinance = async (id: string) => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/api/finances/${id}`, {
        method: "DELETE",
      });
      setFinances((prev) => prev.filter((finance) => finance._id !== id));
    } catch (error) {
      console.error("Error deleting finance:", error);
    }
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleAddCategory = (category: string) => {
    setCategories([...categories, category]);
  };

  const handleDeleteCategory = (category: string) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  const handleOpenFinanceForm = () => {
    setIsFinanceFormOpen(true);
  };

  const handleCloseFinanceForm = () => {
    setIsFinanceFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
        Finance.io
      </h1>

      <div className="max-w-7xl mx-auto">
        <div className="w-full">
          {/* Finance list section */}
          <div>
            <FinanceList
              finances={finances}
              updateFinance={updateFinance}
              deleteFinance={deleteFinance}
              categories={categories}
              handleOpenFinanceForm={handleOpenFinanceForm}
            />
          </div>
        </div>

        {/* Transport fees */}
        <TransportFees />
      </div>

      {/* Finance form dialog */}
      {isFinanceFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 m-6">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-lg w-full sm:w-1/3 z-10">
            <FinanceForm
              addFinance={addFinance}
              categories={categories}
              onOpenSettings={handleOpenSettings}
              onClose={handleCloseFinanceForm}
            />
          </div>
        </div>
      )}

      {/* Settings dialog */}
      {isSettingsOpen && (
        <SettingsDialog
          categories={categories}
          onClose={handleCloseSettings}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
};

export default App;
