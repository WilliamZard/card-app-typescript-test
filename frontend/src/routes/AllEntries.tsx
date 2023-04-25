import { useContext } from "react";
import { EntryContext } from "../utilities/globalContext";
import { EntryContextType, Entry } from "../@types/context";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from '../utilities/themeContext';

export default function AllEntries() {
  const { entries, deleteEntry } = useContext(
    EntryContext
  ) as EntryContextType;
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  if (entries.length === 0) {
    return (
      <section>
        <h1 className="text-center font-semibold text-2xl m-5">
          You don't have any cards
        </h1>
        <p className="text-center font-medium text-md">
          Let's{" "}
          <Link
            className="text-blue-400 underline underline-offset-1"
            to="/create"
          >
            create one
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {entries.map((entry: Entry, index: number) => {
        return (
          <div
            id={entry.id}
            key={index}
            className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-300'} shadow-md shadow-gray-500`}
          >
            <h1 className="font-bold text-sm md:text-lg">{entry.title}</h1>
            <p className="text-center text-lg font-light md:mt-2 md:mb-4 mt-1 mb-3">
              {entry.description}
            </p>
            <section className="flex items-center justify-between flex-col md:flex-row pt-2 md:pt-0">
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    deleteEntry(entry.id as string);
                  }}
                  className="m-1 md:m-2 p-1 font-semibold rounded-md bg-red-500 hover:bg-red-700"
                >
                  ✖
                </button>
                <button
                  onClick={() => {
                    navigate(`/edit/${entry.id}`, { replace: true });
                  }}
                  className="m-1 md:m-2 p-1 font-semibold rounded-md bg-blue-500 hover:bg-blue-700"
                >
                  🖊
                </button>
              </div>
              <div className="text-right">
                <div className="text-sm md:text-lg mb-1">
                  Created:{" "}
                  {new Date(entry.created_at.toString()).toLocaleDateString()}
                </div>
                <div className="text-sm md:text-lg">
                  Scheduled:{" "}
                  {new Date(entry.scheduled_date.toString()).toLocaleDateString()}
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </section>
  );
}