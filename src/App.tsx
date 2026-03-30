import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ProjectProvider } from "./context/ProjectContext"
import 'bootstrap-icons/font/bootstrap-icons.css';
import AddProjectPage from "./pages/AddProjectPage"
import ProjectPage from "./pages/ProjectPage"
import { UserProvider } from "./context/UserContext"
import ProjectEditDetailsPage from "./pages/ProjectEditDetailsPage"
import AppNavbar from "./components/navbar";
import { StoryProvider } from "./context/StoriesContext";
import StoryFormPage from "./pages/StoryFormPage";
import TestUserSelectorPage from "./pages/testPage";


function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <StoryProvider>
          <AppNavbar />
          
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/new" element={<AddProjectPage />} />
              <Route path="/projects/:id" element={<ProjectPage />} />
              <Route path="/projects/edit/:id" element={<ProjectEditDetailsPage />} />
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