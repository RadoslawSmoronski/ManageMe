import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { ProjectProvider } from "./context/ProjectContext"
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  return (
    <ProjectProvider>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </ProjectProvider>
  )
}

export default App