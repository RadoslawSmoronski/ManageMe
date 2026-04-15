import { useState, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { useProjects } from '../context/ProjectsContext';
import ProjectsDesktopList from '../components/projects/ProjectsDesktopList'
import ProjectsMobileList from '../components/projects/ProjectsMobileList'
import { useNavigate } from 'react-router-dom';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, isLoading, removeProject, loadProjects } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => { setVisibleCount(10); }, [searchTerm, statusFilter]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  return (
    <div className="bg-white min-vh-100 py-4">
      <Container style={{ maxWidth: '1100px' }}>
        
        {/* Header */}
        <Container fluid className="px-0 mb-4">
          <Row className="align-items-center gy-3">
            <Col xs={12} sm="auto" className="flex-grow-1">
              <h2 className="fw-bold mb-0 text-dark">Projects</h2>
              <p className="text-muted mb-0 mt-1">Manage and track your progress</p>
            </Col>
            <Col xs={12} sm="auto">
            <Button 
              variant="dark" 
              onClick={() => navigate('/projects/new')}
              className="fw-semibold px-4 py-2 shadow-sm rounded-3 d-flex align-items-center gap-2 transition-all"
              style={{ border: 'none' }}
            >
              <i className="bi bi-plus-lg fs-5"></i>
              <span>New Project</span>
            </Button>
            </Col>
          </Row>
        </Container>

        {/* Filters */}
        <div className="d-flex flex-column flex-md-row gap-3 mb-5">
          <InputGroup className="border rounded-3 shadow-none flex-grow-1">
            <InputGroup.Text className="bg-white border-0 text-muted ps-3"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 shadow-none py-2"
            />
          </InputGroup>
          <Form.Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-3 shadow-none w-100 w-md-auto py-2 px-3"
            style={{ minWidth: '160px' }}
          >
            <option value="All">All statuses</option>
            <option value="Planned">Planned</option>
            <option value="Doing">Doing</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </div>

        {isLoading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="dark" /></div>
        ) : (
          <>
            {/* Desktop Table */}
            <ProjectsDesktopList
              projects={displayedProjects} 
              removeProject={removeProject} 
            />


            {/* Mobile Cards */}
            <ProjectsMobileList
              projects={displayedProjects} 
              removeProject={removeProject} 
            />

            {/* Load More */}
            {visibleCount < filteredProjects.length && (
              <div className="text-center mt-5">
                <Button variant="outline-dark" className="rounded-pill px-5 py-2 fw-bold border-2" onClick={() => setVisibleCount(v => v + 10)}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </Container>

      <style>{`
        .pointer-row { cursor: pointer; transition: 0.2s; border-bottom: 1px solid #f8f8f8 !important; }
        .pointer-row:hover { background-color: #fafafa !important; }
        .no-caret::after { display: none !important; }
        .small { font-size: 0.85rem; }
      `}</style>
    </div>
  );
}