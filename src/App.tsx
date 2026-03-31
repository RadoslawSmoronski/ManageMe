import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ProjectProvider } from "./context/ProjectContext"
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProjectPage from "./pages/ProjectPage"
import { UserProvider } from "./context/UserContext"
import AppNavbar from "./components/navbar";
import { StoryProvider } from "./context/StoriesContext";
import StoryFormPage from "./pages/StoryFormPage";
import ProjectFormPage from "./pages/ProjectFormPage";


function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <StoryProvider>
          <AppNavbar />
          
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="/projects/new" element={<ProjectFormPage />} />
              <Route path="/projects/edit/:id" element={<ProjectFormPage />} />
              <Route path="/projects/:id/stories/add" element={<StoryFormPage />} />
              <Route path="/projects/:id/stories/edit/:storyId" element={<StoryFormPage />} />
            </Routes>
          </div>
        </StoryProvider>
      </ProjectProvider>
    </UserProvider>
  )
}



export default App