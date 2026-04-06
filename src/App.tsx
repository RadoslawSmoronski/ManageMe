import { Routes, Route, Navigate} from "react-router-dom"
import ProjectsPage from "./pages/ProjectsPage"
import { ProjectProvider } from "./context/ProjectContext"
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProjectPage from "./pages/ProjectPage"
import { UserProvider } from "./context/UserContext"
import AppNavbar from "./components/navbar";
import { StoryProvider } from "./context/StoriesContext";
import StoryFormPage from "./pages/StoryFormPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import { TaskProvider } from "./context/TasksContext";
import { StoryPage } from "./pages/StoryPage";


function App() {
  return (
    <UserProvider>
      <ProjectProvider>
        <StoryProvider>
          <TaskProvider>
            <AppNavbar />
            
            <div>
              <Routes>
                <Route path="/" element={<Navigate to="/projects" replace />} />


                <Route path="/projects" element={<ProjectsPage />} />

                <Route path="/projects/:id" element={<ProjectPage />} />
                <Route path="/projects/new" element={<ProjectFormPage />} />
                <Route path="/projects/edit/:id" element={<ProjectFormPage />} />


                <Route path="/projects/:projectId/stories/:storyId" element={<StoryPage />} />
                <Route path="/projects/:projectId/stories/add" element={<StoryFormPage />} />
                <Route path="/projects/:projectId/stories/edit/:storyId" element={<StoryFormPage />} />
              </Routes>
            </div>
          </TaskProvider>
        </StoryProvider>
      </ProjectProvider>
    </UserProvider>
  )
}

export default App