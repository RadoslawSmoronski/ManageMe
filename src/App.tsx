import { Routes, Route, Navigate} from "react-router-dom"
import ProjectsPage from "./pages/ProjectsPage"
import { ProjectsProvider } from "./context/ProjectsContext"
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProjectPage from "./pages/ProjectPage"
import { UsersProvider } from "./context/UsersContext"
import AppNavbar from "./components/navbar";
import { StoriesProvider } from "./context/StoriesContext";
import StoryFormPage from "./pages/StoryFormPage";
import ProjectFormPage from "./pages/ProjectFormPage";
import { TasksProvider } from "./context/TasksContext";
import { StoryPage } from "./pages/StoryPage";


function App() {
  return (
    <UsersProvider>
      <ProjectsProvider>
        <StoriesProvider>
          <TasksProvider>
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
          </TasksProvider>
        </StoriesProvider>
      </ProjectsProvider>
    </UsersProvider>
  )
}

export default App