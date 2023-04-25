import {useState, useContext, ChangeEvent, MouseEvent, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {EntryContext} from '../utilities/globalContext'
import {Entry, EntryContextType} from '../@types/context'
import { ThemeContext } from '../utilities/themeContext';

export default function EditEntry(){
    const {id} = useParams()
    const emptyEntry: Entry = {title: "", description: "",created_at: new Date(), scheduled_date: new Date()}

    const { updateEntry, entries } = useContext(EntryContext) as EntryContextType
    const [newEntry,setNewEntry] = useState<Entry>(emptyEntry)
    const { isDarkMode } = useContext(ThemeContext);
    const sectionClass = `flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 p-8 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}`;

    useEffect(() =>{
        const entry = entries.filter(entry=> entry.id == id)[0]
        setNewEntry(entry)
    },[])
    const handleInputChange = (event: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setNewEntry({
            ...newEntry,
            [event.target.name] : event.target.value
        })
    }
    const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
        updateEntry(id as string,newEntry)
    }
    return(
        <section className={sectionClass}>
            <input className="p-3 rounded-md" type="text" placeholder="Title" name="title" value={newEntry.title} onChange={handleInputChange}/>
            <textarea className="p-3 rounded-md" placeholder="Description" name="description" value={newEntry.description} onChange={handleInputChange}/>
            <input className="p-3 rounded-md" type="date" name="created_at" value={(new Date(newEntry.created_at)).toISOString().split('T')[0]} onChange={handleInputChange}/>
            <input className="p-3 rounded-md" type="date" name="scheduled_date" value={(new Date(newEntry.scheduled_date)).toISOString().split('T')[0]} onChange={handleInputChange}/>
            <button onClick={(e) => {handleSend(e)}} className="bg-blue-400 hover:bg-blue-600 font-semibold text-white p-3 rounded-md">Update</button>
        </section>
    )
}