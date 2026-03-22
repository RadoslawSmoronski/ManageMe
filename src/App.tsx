import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ProjectProvider } from "./context/ProjectContext"
import 'bootstrap-icons/font/bootstrap-icons.css';
import AddProjectPage from "./pages/AddProjectPage"
import ProjectDetailsPage from "./pages/ProjectDetailsPage"
import { UserProvider } from "./context/UserContext"
import AppNavbar from "./components/navbar";


function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <AppNavbar />
        
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/new" element={<AddProjectPage />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          </Routes>
        </div>
      </ProjectProvider>
    </UserProvider>
  )
}

export default App