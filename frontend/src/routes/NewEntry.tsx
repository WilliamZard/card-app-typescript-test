import React, { useState, useContext, ChangeEvent, MouseEvent } from 'react';
import { EntryContext } from '../utilities/globalContext';
import { Entry, EntryContextType } from '../@types/context';
import { ThemeContext } from '../utilities/themeContext';

export default function NewEntry() {
  const emptyEntry: Entry = { title: '', description: '', created_at: new Date() };
  const { saveEntry } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);
  const { isDarkMode } = useContext(ThemeContext);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [event.target.name]: event.target.value,
    });
  };

  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    saveEntry(newEntry);
    setNewEntry(emptyEntry);
  };

  const cardClass = `flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 p-8 rounded-md ${
    isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-300'
  }`;

  const inputClass = `p-3 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}`;

  const buttonClass = `bg-blue-400 hover:bg-blue-600 font-semibold text-white p-3 rounded-md ${
    isDarkMode ? 'bg-blue-600' : ''
  }`;

  return (
    <section className={cardClass}>
      <input
        className={inputClass}
        type="text"
        placeholder="Title"
        name="title"
        value={newEntry.title}
        onChange={handleInputChange}
      />
      <textarea
        className={inputClass}
        placeholder="Description"
        name="description"
        value={newEntry.description}
        onChange={handleInputChange}
      />
      <input
        className={inputClass}
        type="date"
        name="created_at"
        value={(new Date(newEntry.created_at)).toISOString().split('T')[0]}
        onChange={handleInputChange}
      />
      <button onClick={(e) => { handleSend(e) }} className={buttonClass}>
        Create
      </button>
    </section>
  );
}
