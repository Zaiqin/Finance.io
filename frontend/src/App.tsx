import React, { useState, useEffect } from "react";
import FinanceForm from "./components/FinanceForm";
import FinanceList from "./components/FinanceList";
import SettingsDialog from "./components/SettingsDialog";
import PresetsDialog from "./components/PresetsDialog";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Category, Preset, Tag } from "./interfaces/interface";
import logo from "./logo192.png";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const App: React.FC = () => {
  const [finances, setFinances] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isFinanceFormOpen, setIsFinanceFormOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loadedParts, setLoadedParts] = useState<
  { 
    finances: boolean; 
    categories: boolean; 
    presets: boolean;
    tags: boolean;
  }>({
    finances: false,
    categories: false,
    presets: false,
    tags: false,
  });
  const [nightMode, setNightMode] = useState(false);

  useEffect(() => {
    // Detect dark mode preference
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setNightMode(darkModeMediaQuery.matches ? true : false);

    // Add event listener to detect changes in dark mode preference
    const handleChange = (e: MediaQueryListEvent) => {
      setNightMode(e.matches ? true : false);
    };
    darkModeMediaQuery.addEventListener("change", handleChange);

    // Cleanup event listener on component unmount
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchFinances = async () => {
      try {
        //console.log(`${process.env.REACT_APP_SERVER_URL}`);
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
        //console.log(data);
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
        //console.log(`${process.env.REACT_APP_SERVER_URL}`);
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
        //console.log(formattedData);
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
        //console.log(`${process.env.REACT_APP_SERVER_URL}`);
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
        //console.log(data);
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
    if (loadedParts.finances && loadedParts.categories && loadedParts.presets && loadedParts.tags) {
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
      //console.log("Category added successfully");
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
      //console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleUpdateCategory = async (categoryId: string, updatedCategory: string) => {
    if (!isLoggedIn) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/categories/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'user': user!,
          },
          body: JSON.stringify({ description: updatedCategory }),
        }
      );
      const data = await response.json();
      setCategories((prev) =>
        prev.map((category) => (category._id === categoryId ? data : category))
      );
      //console.log("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
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
      //console.log("Preset added successfully");
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

  const handleEditPreset = async (presetId: string, updatedPreset: Preset) => {
    if (!isLoggedIn) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/presets/${presetId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'user': user!,
          },
          body: JSON.stringify(updatedPreset),
        }
      );
      const data = await response.json();
      setPresets((prev) =>
        prev.map((preset) => (preset._id === presetId ? data : preset))
      );
    } catch (error) {
      console.error("Error updating preset:", error);
    }
  }

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
        //console.log("Raw JWT:", credentialResponse.credential);
        //console.log("Decoded JWT:", decoded);
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
    setIsLoading(false);
    setLoadedParts({finances: false, categories: false, presets: false, tags: false});
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchTags();
  }, [isLoggedIn]);

  const fetchTags = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/tags`, {
          headers: {
            'user': user!, // Replace with the actual tenant email
          },
        }
      );
      const data = await response.json();
      setTags(data);
      setLoadedParts((prev) => ({ ...prev, tags: true }));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const addTag = async (tag: Tag) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/tags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user': user!, // Replace with the actual tenant email
          },
          body: JSON.stringify(tag),
        }
      );
      const newTag = await response.json();
      setTags([...tags, newTag]);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const deleteTag = async (id: string) => {
    try {
      await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/tags/${id}`, {
          method: 'DELETE',
          headers: {
            'user': user!, // Replace with the actual tenant email
          },
        }
      );
      setTags(tags.filter(tag => tag._id !== id));
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const updateTag = async (id: string, updatedTag: Tag) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/tags/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'user': user!, // Replace with the actual tenant email
          },
          body: JSON.stringify(updatedTag),
        }
      );
      const newTag = await response.json();
      setTags(tags.map(tag => (tag._id === id ? newTag : tag)));
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${nightMode ? 'bg-[#0a101d]' : 'bg-gray-100'}`}>
      <div className={`flex justify-between items-center ${nightMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 mb-6`}>
        <div className="flex items-center">
          {isLoggedIn && (
            <img
              src={logo}
              alt="Finance.io Logo"
              className="h-8 w-8 mr-2"
            />
          )}
          <h1 className={`text-xl sm:text-2xl pb-0 sm:pb-0.5 font-bold ${nightMode ? 'text-white' : 'text-gray-800'} `}>
            Finance.io
          </h1>
        </div>
        <div className="flex items-center space-x-2">
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline w-24 ${window.innerWidth < 500 ? "h-9 py-1" : "h-10 py-2"}`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              alert("Login Failed");
            }}
            useOneTap
            auto_select
            type={window.innerWidth < 500 ? "icon" : "standard"}
            theme={nightMode ? 'filled_blue' : 'outline'}
          />
        )}
        <button
          type="submit"
          className={`${nightMode ? 'bg-yellow-500 hover:bg-yellow-700 text-gray-700' : 'bg-purple-500 hover:bg-purple-700 text-white'} font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${window.innerWidth < 500 ? "h-9" : "h-10"} flex items-center justify-center`}
          onClick={() => setNightMode(!nightMode)}
        >
          {nightMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
        </div>
      </div>

      {!isLoggedIn || !(loadedParts.finances && loadedParts.categories && loadedParts.presets && loadedParts.tags) ? (
        <div className="flex flex-col items-center justify-center pt-[10vh]">
          <h2 className={`text-xl sm:text-2xl font-semibold mb-4 ${nightMode ? 'text-white' : 'text-gray-700'}`}>
            Welcome to Finance.io
          </h2>
          <p className={`text-lg mb-6 text-center max-w-md w-2/3 ${nightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Finance.io is your personal finance manager. Easily track your income and expenses, categorize transactions, and gain insights into your financial health. Start managing your finances efficiently with Finance.io.
          </p>
          {isLoading && (
            <div className="flex items-center justify-center flex-col">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500 h-10 w-10 mb-2 animate-spin"></div>
              <p className={`${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>Fetching data...</p>
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
                categories={categories}
                handleOpenFinanceForm={handleOpenFinanceForm}
                tags={tags}
                nightMode={nightMode}
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
              <div className={`p-6 rounded shadow-lg w-full sm:w-1/3 min-w-[350px] z-10 ${nightMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
              <FinanceForm
                addFinance={addFinance}
                categories={categories}
                onOpenSettings={handleOpenSettings}
                onOpenPresets={handleOpenPresets}
                onClose={handleCloseFinanceForm}
                presets={presets}
                addTag={addTag}
                deleteTag={deleteTag}
                updateTag={updateTag}
                tags={tags}
                nightMode={nightMode}
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
              onUpdateCategory={handleUpdateCategory}
              nightMode={nightMode}
            />
          )}

          {isPresetsOpen && (
            <PresetsDialog
              presets={presets}
              categories={categories}
              onClose={handleClosePresets}
              onAddPreset={handleAddPreset}
              onDeletePreset={handleDeletePreset}
              onEditPreset={handleEditPreset}
              tags={tags}
              nightMode={nightMode}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
