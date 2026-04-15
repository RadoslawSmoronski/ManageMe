import { Container, Row, Col, Button, Badge, Spinner, Nav } from 'react-bootstrap';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AppBadge } from '../components/AppBadge';
import { useProjects } from '../context/ProjectsContext';
import { confirmDelete } from '../utils/alerts';
import { StoriesColumns } from '../components/stories/StoriesColumns'; 
import { StoriesList } from '../components/stories/StoriesList';


export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'columns' | 'list') || 'columns';

  const { projects, isLoading, removeProject } = useProjects();
  const activeProject = projects.find((project) => project.id === id);

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  if (!activeProject || !id) {
    return (
      <Container className="text-center py-5">
        <h3 className="text-muted">Project not found</h3>
        <Button variant="dark" onClick={() => navigate('/')} className="mt-3">Back to Dashboard</Button>
      </Container>
    );
  }

  const handleDeleteClick = async (e: React.MouseEvent, projectId: string, name: string) => {
    e.stopPropagation();
    const isConfirmed = await confirmDelete(
      "Delete Project?", 
      `Are you sure you want to delete "${name}"? This action is permanent.`
    );
    if (isConfirmed) {
      await removeProject(projectId);
      navigate(`/`);
    }
  };

  const handleTabSelect = (k: string | null) => {
    if (k) setSearchParams({ tab: k });
  };

  return (
    <div className="bg-white min-vh-100 py-4">
      <Container style={{ maxWidth: '1100px' }}>
        
        <section className="py-4 border-bottom mb-4">
          <Row className="align-items-start gy-3">
            <Col xs={12} md={8}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="dark" className="border rounded-pill px-3 py-2 fw-medium">
                  ID: {activeProject.id}
                </Badge>
                <AppBadge value={activeProject.status} />
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

        <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <Nav 
            variant="pills" 
            className="custom-tabs p-1 bg-light rounded-3 d-inline-flex"
            activeKey={activeTab}
            onSelect={handleTabSelect}
          >
            <Nav.Item>
              <Nav.Link eventKey="columns" className="px-4 py-2 fw-bold">
                <i className="bi bi-layout-three-columns me-2"></i>Stories columns
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="list" className="px-4 py-2 fw-bold">
                <i className="bi bi-list-check me-2"></i>Stories list
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Button 
            variant="dark" 
            className="fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
            onClick={() => navigate(`/projects/${id}/stories/add`)}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Story</span>
          </Button>
        </div>

        <section className="animate-fade-in">
          {activeTab === 'columns' ? (
            <StoriesColumns projectId={id} />
          ) : (
            <StoriesList projectId={id} />
          )}
        </section>

      </Container>

      <style>{`
        .custom-tabs .nav-link { color: #6c757d; border-radius: 8px; transition: all 0.2s; }
        .custom-tabs .nav-link.active { background-color: #212529; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .animate-fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}