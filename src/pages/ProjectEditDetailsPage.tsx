import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form } from 'react-bootstrap';
import { useProjects } from '../context/ProjectContext';
import type { ProjectFormData } from '../types/project';

export default function ProjectEditDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, editProject, isLoading } = useProjects();

  const project = projects.find((p) => p.id === id);

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="py-5 text-center">
        <h3 className="fw-bold">Project not found</h3>
        <Button variant="dark" onClick={() => navigate('/')} className="mt-3 rounded-3 px-4">
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = Object.fromEntries(formData.entries()) as unknown as ProjectFormData;

    if (id) {
      await editProject(id, updatedData);
      navigate(`/projects/${id}`)
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: '600px' }}>
        
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-5">
          <Button variant="link" onClick={() => navigate(`/projects/${id}`)} className="text-dark p-0 border-0 shadow-none">
            <i className="bi bi-arrow-left fs-3"></i>
          </Button>
          <h2 className="fw-bold mb-0">Edit Project</h2>
        </div>

        <Form onSubmit={handleSubmit} className="d-grid gap-4">
          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Project Name</label>
            <Form.Control 
              name="name" 
              required 
              defaultValue={project.name} 
              placeholder="Enter project name"
              className="py-3 rounded-3 shadow-none border-light-subtle" 
            />
          </div>

          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Status</label>
            <Form.Select 
              name="status" 
              defaultValue={project.status} 
              className="py-3 rounded-3 shadow-none cursor-pointer border-light-subtle"
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </div>

          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Description</label>
            <Form.Control 
              name="description" 
              as="textarea" 
              rows={6} 
              defaultValue={project.description} 
              placeholder="Describe your project..."
              className="py-3 rounded-3 shadow-none border-light-subtle" 
              style={{ resize: 'none' }}
            />
          </div>

          <div className="d-grid gap-2 pt-4">
            <Button type="submit" variant="dark" className="py-3 fw-bold rounded-3">
              Update Project
            </Button>
            <Button variant="link" onClick={() => navigate(`/projects/${id}`)} className="text-muted text-decoration-none small">
              Cancel and go back
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}