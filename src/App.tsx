import "bootstrap/dist/css/bootstrap.min.css"
import { Navigate, Route, Routes } from "react-router-dom"
import { Container } from "react-bootstrap"
import { NewNote } from "./components/NewNote"


export type Note = {
  id: string
}& NoteData 

export type RawNote = {
  id: string
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

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<h1>Hello World</h1>}/>
        <Route path="/New" element={<NewNote />}/>
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="/:id/edit" element={<h1>Edit</h1>} />
        </Route>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Container>
  )
}

export default App
