import { createContext, useState, FC, ReactNode, useEffect } from 'react';
import { Entry, EntryContextType } from '../@types/context';
import axios from 'axios';

export const EntryContext = createContext<EntryContextType | null>(null);

export const EntryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const initState = async () => {
    const data = await axios.get<Entry[]>('http://localhost:3001/get/');
    const initialStateBody = data.data;
    setEntries(initialStateBody);
  };

  useEffect(() => {
    initState();
    const preferredMode = localStorage.getItem('preferredMode');
    if (preferredMode === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredMode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? 'dark' : 'light';

  const darkTheme = {
    backgroundColor: 'bg-gray-800',
    textColor: 'text-white',
    primaryColor: 'bg-blue-500',
  };

  const lightTheme = {
    backgroundColor: 'bg-white',
    textColor: 'text-black',
    primaryColor: 'bg-blue-500',
  };

  const themeConfig = isDarkMode ? darkTheme : lightTheme;

  const saveEntry = async (entry: Entry) => {
    const requestData = await axios.post<Entry>('http://localhost:3001/create/', entry);
    const newEntry = requestData.data;
    setEntries([...entries, newEntry]);
  };

  const updateEntry = async (id: string, entry: Entry) => {
    await axios.put<Entry>(`http://localhost:3001/update/${id}`, entry);
    setEntries((entries) => {
      const entryIndex = entries.findIndex((obj) => obj.id == id);
      entries[entryIndex] = entry;
      return entries;
    });
  };

  const deleteEntry = async (id: string) => {
    await axios.delete<Entry>(`http://localhost:3001/delete/${id}`);
    setEntries((e) => e.filter((entry) => entry.id != id));
  };

  return (
    <EntryContext.Provider value={{ entries, saveEntry, updateEntry, deleteEntry }}>
      <div className={`min-h-screen ${themeConfig.backgroundColor} ${themeConfig.textColor}`}>
        <button onClick={toggleDarkMode} className={themeConfig.primaryColor}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        {children}
      </div>
    </EntryContext.Provider>
  );
};