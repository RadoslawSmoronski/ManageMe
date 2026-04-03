import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBadge } from '../components/AppBadge';
import { useTasks } from '../context/TasksContext';
import { useStories } from '../context/StoriesContext';
import { confirmDelete } from '../utils/alerts';

export const TaskPage = () => {
  const { projectId, storyId } = useParams();
  const navigate = useNavigate();

  const { tasks } = useTasks();
  const { stories, removeStory } = useStories();

  const activeStory = stories.find(s => s.id === storyId);
  const storyTasks = tasks.filter(t => t.storyId === storyId);

  if (!activeStory) {
    return (
      <Container className="text-center py-5">
        <h3 className="text-muted">Story not found</h3>
        <Button variant="dark" onClick={() => navigate(`/projects/${projectId}`)} className="mt-3">
          Back to Project Board
        </Button>
      </Container>
    );
  }

  const handleDeleteClick = async (e: React.MouseEvent, sId: string, name: string) => {
    e.stopPropagation();
    const isConfirmed = await confirmDelete(
      "Delete Story?", 
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    );
    if (isConfirmed) {
      await removeStory(sId);
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <div className="bg-white min-vh-100 py-4">
      <Container style={{ maxWidth: '1100px' }}>
        
        <section className="py-4 border-bottom mb-4">
          <Row className="align-items-start gy-3">
            <Col xs={12} md={8}>
              <div className="mb-2">
                <span 
                  className="text-muted small fw-bold text-uppercase" 
                  style={{ cursor: 'pointer', letterSpacing: '0.5px' }}
                  onClick={() => navigate(`/projects/${projectId}`)}
                >
                  <i className="bi bi-arrow-left me-1"></i> Back to Project
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="dark" className="border rounded-pill px-3 py-2 fw-medium">
                  STORY ID: {activeStory.id}
                </Badge>
                <AppBadge value={activeStory.status} />
                <AppBadge value={activeStory.priority} />
              </div>
              <h1 className="fw-bold text-dark mb-2">{activeStory.name}</h1>
              <p className="text-muted fs-5 mb-0" style={{ maxWidth: '700px' }}>
                {activeStory.description}
              </p>
            </Col>
            
            <Col xs={12} md={4} className="text-md-end d-flex flex-wrap justify-content-md-end gap-2 align-items-center">
              <Button 
                variant="outline-dark" 
                className="fw-semibold px-4 py-2 shadow-sm rounded-3 d-flex align-items-center gap-2 border-2"
                onClick={() => navigate(`/projects/${projectId}/stories/edit/${storyId}`)}
              >
                <i className="bi bi-pencil"></i>
                <span>Edit Story</span>
              </Button>

              <Button 
                variant="danger" 
                className="fw-semibold px-3 py-2 shadow-sm rounded-3 d-flex align-items-center justify-content-center border-0"
                onClick={(e) => handleDeleteClick(e, activeStory.id, activeStory.name)}
                style={{ height: '42px', width: '45px' }}
              >
                <i className="bi bi-trash3 fs-5"></i>
              </Button>
            </Col>
          </Row>
        </section>

        <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold text-dark mb-0">
              <i className="bi bi-layout-three-columns me-2"></i>Tasks progress
            </h4>
            <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-bold">
              {storyTasks.length} tasks total
            </Badge>
          </div>

          <Button 
            variant="dark" 
            className="fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Task</span>
          </Button>
        </div>


        <section className="animate-fade-in">
        </section>

      </Container>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};