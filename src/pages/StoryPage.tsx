import { Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBadge } from '../components/AppBadge';
import { useTasks } from '../context/TasksContext';
import { useStories } from '../context/StoriesContext';
import { confirmDelete } from '../utils/alerts';
import { TasksBoard } from '../components/tasks/TasksBoard';
import { useEffect } from 'react';
import AppButton from '../components/AppButton';

export const StoryPage = () => {
  const { projectId, storyId } = useParams();
  const navigate = useNavigate();

  const { tasks, loadTasks, isLoading: isTasksLoading } = useTasks();
  const { stories, removeStory, loadStories, isLoading: isStoriesLoading } = useStories();

  useEffect(() => {
    loadTasks();
    loadStories();
  }, [loadTasks, loadStories]);

  if (isTasksLoading || isStoriesLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }
  
  const activeStory = stories.find(s => s.id === storyId);
  const storyTasks = tasks.filter(t => t.storyId === storyId);

  if (!activeStory) {
    return (
      <Container className="text-center py-5">
        <h3 className="text-body-secondary">Story not found</h3>
        <AppButton intent="primary" onClick={() => navigate(`/projects/${projectId}`)} className="mt-3">
          Back to Project Board
        </AppButton>
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
    <div className="bg-body min-vh-100 py-4">
      <Container style={{ maxWidth: '1100px' }}>
        
        <section className="py-4 border-bottom mb-4">
          <Row className="align-items-start gy-3">
            <Col xs={12} md={8}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="secondary-subtle" className="text-body-emphasis border border-secondary-subtle rounded-pill px-3 py-2 fw-medium">
                  STORY ID: {activeStory.id}
                </Badge>
                <AppBadge value={activeStory.status} />
                <AppBadge value={activeStory.priority} />
              </div>
              <h1 className="fw-bold text-body mb-2">{activeStory.name}</h1>
              <p className="text-body-secondary fs-5 mb-0" style={{ maxWidth: '700px' }}>
                {activeStory.description}
              </p>
            </Col>
            
            <Col xs={12} md={4} className="text-md-end d-flex flex-wrap justify-content-md-end gap-2 align-items-center">
              <AppButton
                intent="ghost"
                className="fw-semibold px-4 py-2 shadow-sm rounded-3 d-flex align-items-center gap-2 border-2"
                onClick={() => navigate(`/projects/${projectId}/stories/edit/${storyId}`)}
              >
                <i className="bi bi-pencil"></i>
                <span>Edit Story</span>
              </AppButton>

              <AppButton
                intent="danger"
                className="fw-semibold px-3 py-2 shadow-sm rounded-3 d-flex align-items-center justify-content-center border-0"
                onClick={(e) => handleDeleteClick(e, activeStory.id, activeStory.name)}
                style={{ height: '42px', width: '45px' }}
              >
                <i className="bi bi-trash3 fs-5"></i>
              </AppButton>
            </Col>
          </Row>
        </section>

        <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold text-body mb-0">
              <i className="bi bi-layout-three-columns me-2"></i>Tasks progress
            </h4>
            <Badge bg="secondary-subtle" className="text-body-emphasis border border-secondary-subtle px-3 py-2 rounded-pill fw-bold">
              {storyTasks.length} tasks total
            </Badge>
          </div>

          <AppButton
            intent="primary"
            onClick={() => navigate(`/projects/${projectId}/stories/${storyId}/tasks/add`)}
            className="fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Task</span>
          </AppButton>
        </div>


        <section className="animate-fade-in">
            <TasksBoard projectId={projectId!} storyId={storyId!} />
        </section>

      </Container>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};