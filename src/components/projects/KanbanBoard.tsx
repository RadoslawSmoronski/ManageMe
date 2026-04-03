import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom'; // Import navigate
import { useStories } from '../../context/StoriesContext';
import type { ProgressStatus } from '../../types/common';
import { AppBadge } from '../AppBadge'

interface KanbanBoardProps {
  projectId: string;
}

export const COLUMNS = ['Todo', 'Doing', 'Done'] as ProgressStatus[];

export const KanbanBoard = ({ projectId }: KanbanBoardProps) => {
  const navigate = useNavigate(); // Hook for navigation
  const { getProjectStories, isLoading, editStory } = useStories();
  const projectStories = getProjectStories(projectId);

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="dark" />
        <p className="text-muted mt-2">Loading stories...</p>
      </Container>
    );
  }

  const getStoriesByStatus = (status: ProgressStatus) => 
    projectStories.filter(story => story.status === status);

  // Handle clicking on a story to edit
  const handleEditClick = (storyId: string) => {
    navigate(`/projects/${projectId}/stories/edit/${storyId}`);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId as ProgressStatus;
    const destStories = getStoriesByStatus(newStatus);
    let newPosition: number;

    if (destStories.length === 0) {
      newPosition = 1000;
    } else if (destination.index === 0) {
      newPosition = destStories[0].position / 2;
    } else if (destination.index >= destStories.length) {
      newPosition = destStories[destStories.length - 1].position + 1000;
    } else {
      const prevStory = destStories[destination.index - 1];
      const nextStory = destStories[destination.index];
      
      if (source.droppableId === destination.droppableId && source.index < destination.index) {
          const actualNext = destStories[destination.index + 1];
          newPosition = actualNext 
            ? (nextStory.position + actualNext.position) / 2 
            : nextStory.position + 1000;
      } else {
          newPosition = (prevStory.position + nextStory.position) / 2;
      }
    }

    await editStory(draggableId, { 
      status: newStatus, 
      position: newPosition 
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container fluid className="py-4 px-3">
        <Row className="g-4">
          {COLUMNS.map((col) => {
            const filteredStories = getStoriesByStatus(col);
            
            return (
              <Col key={col} xs={12} lg={4}>
                {/* Column Header */}
                <div className="d-flex align-items-center justify-content-between mb-3 px-2">
                  <div className="d-flex align-items-center gap-2">
                    <h5 className="fw-bold text-uppercase small text-muted mb-0">{col}</h5>
                    <Badge bg="light" text="dark" className="rounded-pill border">
                      {filteredStories.length}
                    </Badge>
                  </div>
                  
                  {/* Add Story Button - passing initial status via query param */}
                  <Button 
                    variant="link" 
                    className="text-dark p-0 border-0 shadow-none d-flex align-items-center"
                    onClick={() => navigate(`/projects/${projectId}/stories/add?status=${col}`)}
                  >
                    <i className="bi bi-plus-lg fs-5"></i>
                  </Button>
                </div>

                <Droppable droppableId={col}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`kanban-column rounded-4 p-2 transition-all ${
                        snapshot.isDraggingOver ? 'bg-secondary-subtle' : 'bg-light'
                      }`}
                      style={{ minHeight: '70vh' }}
                    >
                      {filteredStories.map((story, index) => (
                        <Draggable key={story.id} draggableId={story.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              // Trigger edit on click
                              onClick={() => handleEditClick(story.id)}
                              className={`mb-3 border-0 shadow-sm rounded-3 ${
                                snapshot.isDragging ? 'shadow-lg bg-white' : ''
                              }`}
                              style={{ 
                                ...provided.draggableProps.style, 
                                cursor: 'pointer' // Changed from grab to pointer to signal clickability
                              }}
                            >
                              <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <AppBadge value={story.priority} />
                                </div>
                                <Card.Title className="fs-6 fw-bold mb-1">{story.name}</Card.Title>
                                <Card.Text className="text-secondary small text-truncate-2">
                                  {story.description}
                                </Card.Text>
                                <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                    ID: {story.id.slice(0, 4)}
                                  </span>
                                  <div className="bg-dark rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                                    {story.projectId.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {filteredStories.length === 0 && !snapshot.isDraggingOver && (
                        <div className="text-center py-5 text-muted small italic">No stories here</div>
                      )}
                    </div>
                  )}
                </Droppable>
              </Col>
            );
          })}
        </Row>
      </Container>
    </DragDropContext>
  );
};
