import React, { useState, useEffect } from "react";
import FinanceForm from "./components/FinanceForm";
import FinanceList from "./components/FinanceList";
import SettingsDialog from "./components/SettingsDialog";
import PresetsDialog from "./components/PresetsDialog";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface Preset {
  _id: string | undefined;
  amount: number;
  description: string;
  category: string | undefined;
}

interface Category {
  _id: string | undefined;
  description: string;
}

const App: React.FC = () => {
  const [finances, setFinances] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isFinanceFormOpen, setIsFinanceFormOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loadedParts, setLoadedParts] = useState<{ finances: boolean; categories: boolean; presets: boolean }>({
    finances: false,
    categories: false,
    presets: false,
  });

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchFinances = async () => {
      try {
        console.log(`${process.env.REACT_APP_SERVER_URL}`);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/finances`, {
            headers: {
              'user': user!, // Replace with the actual tenant email
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setFinances(data);
        setLoadedParts((prev) => ({ ...prev, finances: true }));
      } catch (error) {
        console.error("Error fetching finances:", error);
      }
    };
    fetchFinances();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchPresets = async () => {
      try {
        console.log(`${process.env.REACT_APP_SERVER_URL}`);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/presets`, {
            headers: {
              'user': user!,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.map((preset: any) => ({
          ...preset,
          amount: parseFloat(preset.amount).toFixed(2),
        }));
        console.log(formattedData);
        setPresets(formattedData);
        setLoadedParts((prev) => ({ ...prev, presets: true }));
      } catch (error) {
        console.error("Error fetching presets:", error);
      }
    };
    fetchPresets();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchCategories = async () => {
      try {
        console.log(`${process.env.REACT_APP_SERVER_URL}`);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/categories`, {
            headers: {
              'user': user!,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCategories(data);
        setLoadedParts((prev) => ({ ...prev, categories: true }));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [isLoggedIn]);

  const addFinance = async (finance: any) => {
    if (!isLoggedIn) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/finances`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'user': user!,
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
    if (!isLoggedIn) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/finances/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'user': user!,
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
    if (!isLoggedIn) return;

    try {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/api/finances/${id}`, {
        method: "DELETE",
        headers: {
          'user': user!,
        },
      });
      setFinances((prev) => prev.filter((finance) => finance._id !== id));
    } catch (error) {
      console.error("Error deleting finance:", error);
    }
  };

  const handleOpenSettings = () => {
    if (!isLoggedIn) return;
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleOpenPresets = () => {
    if (!isLoggedIn) return;
    setIsPresetsOpen(true);
  };

  const handleClosePresets = () => {
    setIsPresetsOpen(false);
  };

  useEffect(() => {
    if (loadedParts.finances && loadedParts.categories && loadedParts.presets) {
      setIsLoading(false);
    }
  }, [loadedParts])
  

  const handleAddCategory = async (description: string) => {
    if (!isLoggedIn) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'user': user!,
          },
          body: JSON.stringify({ description }),
        }
      );
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      console.log("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!isLoggedIn) return;

    try {
      await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: { 'user': user! },
        }
      );
      setCategories(categories.filter((cat) => cat._id !== categoryId));
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddPreset = async (preset: Preset) => {
    if (!isLoggedIn) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/presets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'user': user!,
          },
          body: JSON.stringify(preset),
        }
      );
      const newPreset = await response.json();
      setPresets([...presets, newPreset]);
      console.log("Preset added successfully");
    } catch (error) {
      console.error("Error adding preset:", error);
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    if (!isLoggedIn) return;

    try {
      await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/presets/${presetId}`,
        {
          method: "DELETE",
          headers: { 'user': user! },
        }
      );
      setPresets((prev) => prev.filter((preset) => preset._id !== presetId));
    } catch (error) {
      console.error("Error deleting preset:", error);
    }
  };

  const handleOpenFinanceForm = () => {
    if (!isLoggedIn) return;
    setIsFinanceFormOpen(true);
  };

  const handleCloseFinanceForm = () => {
    setIsFinanceFormOpen(false);
  };

  const handleLoginSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      if (credentialResponse?.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        console.log("Raw JWT:", credentialResponse.credential);
        console.log("Decoded JWT:", decoded);
        if (!decoded.email) {
          console.error("Email not found in the JWT");
          return;
        }

        setIsLoggedIn(true);
        setUser(decoded.email);
      } else {
        console.error("No credential found in the response");
      }
    } catch (error) {
      console.error("Error in login flow:", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex justify-between items-center bg-white shadow-md p-4 mb-6">
        <h1 className="text-2xl sm:text-2xl font-bold text-gray-800">
          Finance.io
        </h1>
        {isLoggedIn ? (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />
        )}
      </div>

      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center pt-[30vh]">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
            Welcome to Finance.io
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Please log in to manage your finances.
          </p>
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500 h-10 w-10 mb-4 animate-spin"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="w-full">
            <div>
              <FinanceList
                finances={finances}
                updateFinance={updateFinance}
                deleteFinance={deleteFinance}
                categories={categories.map((category) => category.description)}
                handleOpenFinanceForm={handleOpenFinanceForm}
              />
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <>
          {isFinanceFormOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-10 m-6">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="bg-white p-6 rounded shadow-lg w-full sm:w-1/3 min-w-[350px] z-10">
                <FinanceForm
                  addFinance={addFinance}
                  categories={categories.map((category) => category.description)}
                  onOpenSettings={handleOpenSettings}
                  onOpenPresets={handleOpenPresets}
                  onClose={handleCloseFinanceForm}
                  presets={presets}
                />
              </div>
            </div>
          )}

          {isSettingsOpen && (
            <SettingsDialog
              categories={categories}
              onClose={handleCloseSettings}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {isPresetsOpen && (
            <PresetsDialog
              presets={presets}
              categories={categories.map((category) => category.description)}
              onClose={handleClosePresets}
              onAddPreset={handleAddPreset}
              onDeletePreset={handleDeletePreset}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
