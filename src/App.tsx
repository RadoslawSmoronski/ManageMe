import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ProjectProvider } from "./context/ProjectContext"
import 'bootstrap-icons/font/bootstrap-icons.css';
import AddProjectPage from "./pages/AddProjectPage"
import ProjectPage from "./pages/ProjectPage"
import { UserProvider } from "./context/UserContext"
import ProjectEditDetailsPage from "./pages/ProjectEditDetailsPage"
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
            <Route path="/projects/:id" element={<ProjectPage />} />
            <Route path="/projects/edit/:id" element={<ProjectEditDetailsPage />} />
          </Routes>
        </div>
      </ProjectProvider>
    </UserProvider>
  )
}

export default App