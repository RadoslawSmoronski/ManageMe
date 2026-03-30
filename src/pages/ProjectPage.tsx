import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectStatusBadge } from '../components/projects/ProjectStatusBadge';
import { useProjects } from '../context/ProjectContext';
import { confirmDelete } from '../utils/alerts';
import { KanbanBoard } from '../components/projects/KanbanBoard';


export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeProject, isLoading, setActiveProjectId, removeProject } = useProjects();
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'stories'>('tasks');

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
      navigate(`/`);
    }
  };

  return (
    <div className="bg-white min-vh-100 py-4">
      <Container style={{ maxWidth: '1100px' }}>
        
        {/* Header Section */}
        <section className="py-4 border-bottom mb-4">
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

        {/* Tabs Navigation Section */}
        <div className="mb-4">
          <Nav 
            variant="pills" 
            className="custom-tabs p-1 bg-light rounded-3 d-inline-flex w-100 w-md-auto"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k as 'tasks' | 'stories')}
          >
            <Nav.Item className="flex-fill flex-md-grow-0">
              <Nav.Link eventKey="tasks" className="text-center px-4 py-2 fw-bold">
                <i className="bi bi-layout-three-columns me-2"></i>Tasks
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="flex-fill flex-md-grow-0">
              <Nav.Link eventKey="stories" className="text-center px-4 py-2 fw-bold">
                <i className="bi bi-list-check me-2"></i>Stories
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* Content Section */}
        <section className="animate-fade-in">
          {activeTab === 'tasks' ? (
            <KanbanBoard projectId={activeProject.id} />
          ) : (
            "Stories"
          )}
        </section>

      </Container>

      <style>{`
        .custom-tabs .nav-link {
          color: #6c757d;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .custom-tabs .nav-link.active {
          background-color: #212529;
          color: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .custom-tabs { display: flex; }
        }
      `}</style>
    </div>
  );
}