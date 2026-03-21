import { Row, Col, Card } from 'react-bootstrap';
import type { Project } from '../../types/project';
import { useNavigate } from 'react-router-dom';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { confirmDelete } from '../../utils/alerts';

export interface ProjectsMobileListProps {
  projects: Project[];
  removeProject: (id: string) => void;
}

export default function ProjectsMobileList({ projects, removeProject }: ProjectsMobileListProps) {
  const navigate = useNavigate();

      const handleDeleteClick = async (e: React.MouseEvent, id: string, name: string) => {
          e.stopPropagation();
  
          const isConfirmed = await confirmDelete(
              "Delete Project?", 
              `Are you sure you want to delete "${name}"? This action is permanent.`
          );
  
          if (isConfirmed) {
              removeProject(id);
          }
      };

  return (
    <div className="d-lg-none px-2">
      <Row className="g-3">
        {projects.map((p) => (
          <Col xs={12} key={p.id}>
            <Card className="border-0 rounded-4 shadow-sm overflow-hidden">
              <div className="d-flex align-items-stretch" style={{ minHeight: '120px' }}>
                
                <Card.Body 
                  className="p-4 flex-grow-1 d-flex flex-column justify-content-center" 
                  onClick={() => navigate(`/projects/${p.id}`)}
                  style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                >
                  <h5 className="fw-bold mb-1 text-dark text-truncate">{p.name}</h5>
                  <p className="text-muted small mb-3 text-truncate-2" style={{ lineHeight: '1.2' }}>
                    {p.description}
                  </p>
                  <div>
                    <ProjectStatusBadge status={p.status} />
                  </div>
                </Card.Body>

                <div 
                  className="d-flex flex-column align-items-center justify-content-center"
                  onClick={(e) => handleDeleteClick(e, p.id, p.name)}
                  style={{ 
                    width: '100px',
                    backgroundColor: '#fff1f1',
                    cursor: 'pointer',
                    borderLeft: '1px solid #fde2e2',
                    color: '#dc3545',
                    transition: 'all 0.2s'
                  }}
                >
                <i className="bi bi-trash3"></i>
                </div>

              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}