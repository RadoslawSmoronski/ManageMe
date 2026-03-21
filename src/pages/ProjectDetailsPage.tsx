import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form } from 'react-bootstrap';
import { useProjects } from '../context/ProjectContext';
import { ProjectStatusBadge } from '../components/projects/ProjectStatusBadge';
import { confirmDelete } from '../utils/alerts';
import type { ProjectFormData } from '../types/project';

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, editProject, removeProject, isLoading} = useProjects();

  const [isEditing, setIsEditing] = useState(false);

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
    const data = new FormData(e.currentTarget);
    const updatedData = Object.fromEntries(data.entries()) as unknown as ProjectFormData;

    if (id) {
      await editProject(id, updatedData);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (await confirmDelete("Delete Project?", `Are you sure you want to remove ${project.name}?`)) {
      await removeProject(project.id);
      navigate('/');
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: '600px' }}>
        
        {/* Header - Back Button & Title */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <Button variant="link" onClick={() => navigate('/')} className="text-dark p-0 border-0 shadow-none">
              <i className="bi bi-arrow-left fs-3"></i>
            </Button>
            <h2 className="fw-bold mb-0">{isEditing ? 'Edit Project' : 'Project Details'}</h2>
          </div>
          
          {!isEditing && (
            <Button variant="link" onClick={handleDelete} className="text-danger p-0 border-0 shadow-none">
              <i className="bi bi-trash fs-4"></i>
            </Button>
          )}
        </div>

        {isEditing ? (
          /* EDIT MODE: Matching your AddProjectPage style */
          <Form onSubmit={handleSubmit} className="d-grid gap-4">
            <div>
              <label className="fw-bold small text-uppercase mb-2 text-muted">Project Name</label>
              <Form.Control 
                name="name" 
                required 
                defaultValue={project.name} 
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
                className="py-3 rounded-3 shadow-none border-light-subtle" 
                style={{ resize: 'none' }}
              />
            </div>

            <div className="d-grid gap-2 pt-2">
              <Button type="submit" variant="dark" className="py-3 fw-bold rounded-3">Save Changes</Button>
              <Button variant="link" onClick={() => setIsEditing(false)} className="text-muted text-decoration-none small">
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          /* VIEW MODE: Flat and Minimalist */
          <div className="d-grid gap-4">
            <div>
              <label className="fw-bold small text-uppercase mb-1 text-muted">Project Name</label>
              <h1 className="fw-bold display-6">{project.name}</h1>
            </div>

            <div>
              <label className="fw-bold small text-uppercase mb-2 text-muted d-block">Status</label>
              <ProjectStatusBadge status={project.status} />
            </div>

            <div className="mt-2">
              <label className="fw-bold small text-uppercase mb-2 text-muted">Description</label>
              <p className="fs-5 text-secondary lh-base" style={{ whiteSpace: 'pre-wrap' }}>
                {project.description || "No description provided."}
              </p>
            </div>

            <div className="pt-4">
              <Button variant="dark" onClick={() => setIsEditing(true)} className="py-3 fw-bold rounded-3 w-100 shadow-sm">
                Edit Project
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}