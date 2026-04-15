import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form, Spinner } from 'react-bootstrap';
import { useProjects } from '../context/ProjectsContext';
import { useUsers } from '../context/UsersContext';
import { UserSelector } from '../components/UserSelector';
import type { ProjectFormData } from '../types/project';

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, addProject, editProject, isLoading, loadProjects } = useProjects();
  const { currentUser } = useUsers();

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      loadProjects();
    }
  }, [isEditMode, loadProjects]);

  const project = projects.find((p) => p.id === id);

  if (!currentUser && !isEditMode) {
    navigate('/');
    return null;
  }

  if (isEditMode && isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  if (isEditMode && !project) {
    return (
      <Container className="py-5 text-center">
        <h3 className="fw-bold">Project not found</h3>
        <Button variant="dark" onClick={() => navigate('/')} className="mt-3 rounded-3">Back to Dashboard</Button>
      </Container>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const formData = Object.fromEntries(data.entries()) as unknown as ProjectFormData;

    if (isEditMode && id) {
      await editProject(id, formData);
      navigate(`/projects/${id}`);
    } else {
      await addProject(formData);
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
          <h2 className="fw-bold mb-0">
            {isEditMode ? 'Edit Project' : 'New Project'}
          </h2>
        </div>

        <Form onSubmit={handleSubmit} className="d-grid gap-4">
          
          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Project Name</label>
            <Form.Control 
              name="name" 
              required 
              defaultValue={project?.name || ''} 
              placeholder="e.g. Manage Me" 
              className="py-3 rounded-3 shadow-none border-light-subtle" 
            />
          </div>

          <div>
            <UserSelector 
              label="Project Owner" 
              name="ownerId" 
              defaultValue={project?.ownerId || currentUser?.id} 
            />
          </div>

          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Status</label>
            <Form.Select 
              name="status" 
              defaultValue={project?.status || 'Planned'} 
              className="py-3 rounded-3 shadow-none cursor-pointer border-light-subtle"
            >
              <option value="Planned">Planned</option>
              <option value="Doing">Doing</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </div>

          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Description</label>
            <Form.Control 
              name="description" 
              as="textarea" 
              rows={4} 
              defaultValue={project?.description || ''} 
              placeholder="Description..." 
              className="py-3 rounded-3 shadow-none border-light-subtle" 
              style={{ resize: 'none' }}
            />
          </div>

          <div className="d-grid gap-2 pt-2">
            <Button type="submit" variant="dark" className="py-3 fw-bold rounded-3 shadow-sm">
              {isEditMode ? 'Update Project' : 'Create Project'}
            </Button>
            <Button variant="link" onClick={() => navigate(-1)} className="text-muted text-decoration-none small">
              Discard changes
            </Button>
          </div>

        </Form>
      </Container>
    </div>
  );
}