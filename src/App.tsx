import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ProjectProvider } from "./context/ProjectContext"
import 'bootstrap-icons/font/bootstrap-icons.css';
import AddProjectPage from "./pages/AddProjectPage"



function App() {
  return (
    <ProjectProvider>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/new" element={<AddProjectPage />} />
        </Routes>
      </div>
    </ProjectProvider>
  )
}

export default App