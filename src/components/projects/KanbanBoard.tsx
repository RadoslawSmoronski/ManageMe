import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useStories } from '../../context/StoriesContext';
import type { Story, StoryStatus } from '../../types/story';

interface KanbanBoardProps {
  projectId: string;
  onStoryClick?: (id: string) => void;
}

const COLUMNS: { label: string; value: StoryStatus }[] = [
  { label: 'To Do', value: 'Todo' },
  { label: 'In Progress', value: 'Doing' },
  { label: 'Done', value: 'Done' },
];

export const KanbanBoard = ({ projectId, onStoryClick }: KanbanBoardProps) => {
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

  const getStoriesByStatus = (status: StoryStatus) => 
    projectStories.filter(story => story.status === status);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const newStatus = destination.droppableId as StoryStatus;
    const destStories = getStoriesByStatus(newStatus);
    let newPosition: number;

    // Position Calculation Logic (Fractional Indexing)
    if (destStories.length === 0) {
      newPosition = 1000;
    } else if (destination.index === 0) {
      newPosition = destStories[0].position / 2;
    } else if (destination.index >= destStories.length) {
      newPosition = destStories[destStories.length - 1].position + 1000;
    } else {
      const prevStory = destStories[destination.index - 1];
      const nextStory = destStories[destination.index];
      
      // Adjust neighbor logic if moving down in the same column
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
            const filteredStories = getStoriesByStatus(col.value);
            
            return (
              <Col key={col.value} xs={12} lg={4}>
                <div className="d-flex align-items-center justify-content-between mb-3 px-2">
                  <h5 className="fw-bold text-uppercase small text-muted mb-0">{col.label}</h5>
                  <Badge bg="light" text="dark" className="rounded-pill border">
                    {filteredStories.length}
                  </Badge>
                </div>

                <Droppable droppableId={col.value}>
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
                              className={`mb-3 border-0 shadow-sm rounded-3 ${
                                snapshot.isDragging ? 'shadow-lg bg-white' : ''
                              }`}
                              style={{ ...provided.draggableProps.style, cursor: 'grab' }}
                              onClick={() => onStoryClick?.(story.id)}
                            >
                              <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <PriorityBadge priority={story.priority} />
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

const PriorityBadge = ({ priority }: { priority: Story['priority'] }) => {
  const colors = { High: 'danger', Medium: 'warning', Low: 'info' };
  return (
    <Badge bg={colors[priority]} className="small rounded-pill" style={{ fontSize: '0.65rem' }}>
      {priority}
    </Badge>
  );
};