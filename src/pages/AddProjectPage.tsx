import { Container, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import type { ProjectFormData } from '../types/project';

export default function AddProjectPage() {
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const data = new FormData(e.currentTarget);
    const newProject = Object.fromEntries(data.entries()) as unknown as ProjectFormData;

    if (newProject.name) {
      addProject(newProject);
      navigate('/');
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: '600px' }}>
        
        <div className="d-flex align-items-center gap-3 mb-4">
          <Button variant="link" onClick={() => navigate(-1)} className="text-dark p-0 border-0 shadow-none">
            <i className="bi bi-arrow-left fs-3"></i>
          </Button>
          <h2 className="fw-bold mb-0">New Project</h2>
        </div>

        <Form onSubmit={handleSubmit} className="d-grid gap-4">
          
          <div>
            <label className="fw-bold small text-uppercase mb-2">Project Name</label>
            <Form.Control name="name" required placeholder="e.g. Manage Me" className="py-3 rounded-3 shadow-none" />
          </div>

          <div>
            <label className="fw-bold small text-uppercase mb-2">Initial Status</label>
            <Form.Select name="status" className="py-3 rounded-3 shadow-none cursor-pointer">
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </div>

          <div>
            <label className="fw-bold small text-uppercase mb-2">Description</label>
            <Form.Control name="description" as="textarea" rows={4} placeholder="Description..." className="py-3 rounded-3 shadow-none" />
          </div>

          <div className="d-grid gap-2 pt-2">
            <Button type="submit" variant="dark" className="py-3 fw-bold rounded-3">Create Project</Button>
            <Button variant="link" onClick={() => navigate('/')} className="text-muted text-decoration-none small">Discard changes</Button>
          </div>

        </Form>
      </Container>
    </div>
  );
}