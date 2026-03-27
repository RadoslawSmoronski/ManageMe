import { useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectStatusBadge } from '../components/projects/ProjectStatusBadge';
import { useProjects } from '../context/ProjectContext';
import { confirmDelete } from '../utils/alerts';
import { KanbanBoard } from '../components/projects/KanbanBoard';



export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeProject, isLoading, setActiveProjectId, removeProject } = useProjects();

  useEffect(() => {
    if (id) {
      setActiveProjectId(id);
    }
  }, [id, setActiveProjectId]);

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  if (!activeProject) {
    return (
      <Container className="text-center py-5">
        <h3 className="text-muted">Project not found</h3>
        <Button variant="dark" onClick={() => navigate('/')} className="mt-3">Back to Dashboard</Button>
      </Container>
    );
  }

    const handleDeleteClick = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();

        const isConfirmed = await confirmDelete(
            "Delete Project?", 
            `Are you sure you want to delete "${name}"? This action is permanent.`
        );

        if (isConfirmed) {
            await removeProject(id);
            navigate(`/`)
        }
    };


  return (
    <div className="bg-white min-vh-100 py-4">
      <Container style={{ maxWidth: '1100px' }}>
        
        <section className="py-4 border-bottom mb-5">
          <Row className="align-items-start gy-3">
            <Col xs={12} md={8}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="dark" className="border rounded-pill px-3 py-2 fw-medium">
                  ID: {activeProject.id}
                </Badge>
                <ProjectStatusBadge status={activeProject.status} />
              </div>
              <h1 className="fw-bold text-dark mb-2">{activeProject.name}</h1>
              <p className="text-muted fs-5 mb-0" style={{ maxWidth: '700px' }}>
                {activeProject.description}
              </p>
            </Col>
            
            <Col xs={12} md={4} className="text-md-end d-flex flex-wrap justify-content-md-end gap-2 align-items-center">
            
            <Button 
                variant="outline-dark" 
                className="fw-semibold px-4 py-2 shadow-sm rounded-3 d-flex align-items-center gap-2 border-2"
                onClick={() => navigate(`/projects/edit/${activeProject.id}`)}
            >
                <i className="bi bi-pencil"></i>
                <span>Edit Project</span>
            </Button>

            <Button 
                variant="danger" 
                className="fw-semibold px-3 py-2 shadow-sm rounded-3 d-flex align-items-center justify-content-center border-0"
                onClick={(e) => handleDeleteClick(e, activeProject.id, activeProject.name)}
                style={{ height: '42px', width: '45px' }}
            >
                <i className="bi bi-trash3 fs-5"></i>
            </Button>

            </Col>
          </Row>
        </section>

        <section>
          <KanbanBoard projectId={activeProject.id} />
        </section>

      </Container>

      <style>{`
        .border-dashed { border-style: dashed !important; border-width: 2px !important; }
        h1 { letter-spacing: -1px; }
      `}</style>
    </div>
  );
}