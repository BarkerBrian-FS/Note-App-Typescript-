import "bootstrap/dist/css/bootstrap.min.css"
import { Navigate, Route, Routes } from "react-router-dom"
import { Container } from "react-bootstrap"
import { NewNote } from "./components/NewNote"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useMemo } from "react"
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./components/NoteList"
import { NoteLayout } from "./components/NoteLayout"
import { Note } from "./components/Note"
import { EditNote } from "./components/EditNote"


export type Note = {
  id: string
}& NoteData 

export type RawNote = {
  id: string
  markdown: string
  tagIds: string[]
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

function App() {
 const [ notes, setNotes ] = useLocalStorage<RawNote[]>("NOTES", [])
 const [ tags, setTags ] = useLocalStorage<Tag[]>("TAGS", [])

 const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id) )}
    })
 }, [notes, tags])

 function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) },
      ]
    })
  }

  function addTag(tag: Tag){
    setTags(prev => [...prev, tag])
  }

  function onUpdateNote(id: string, {tags, ...data}:NoteData){
     setNotes(prevNotes => {
      return prevNotes.map(note => {
        if(note.id === id){
          return { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }
        }else {
          return note
        }
      })
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag} /> }/>
        <Route path="/New" element={
          <NewNote 
          onSubmit={onCreateNote} 
          onAddTag={addTag} 
          availableTags={tags}/>}/>
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={deleteTag}/>} />
          <Route path="/:id/edit" element={
            <EditNote 
            onSubmit={onUpdateNote} 
            onAddTag={addTag} 
            availableTags={tags} />} />
        </Route>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Container>
  )
}

export default App
