import { Container, Badge, Spinner } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../context/TasksContext';
import { AppBadge } from '../AppBadge';
import type { Task, PlannedTask, DoingTask, CompletedTask } from '../../types/task';

interface TasksBoardProps {
  projectId: string;
  storyId: string;
}

const COLUMNS = ['Planned', 'Doing', 'Completed'] as const;

export const TasksBoard = ({ projectId, storyId }: TasksBoardProps) => {
  const navigate = useNavigate();
  const { tasks, isLoading, updateTaskInApi } = useTasks();

  if (isLoading) return (
    <div className="text-center py-5"><Spinner animation="border" variant="primary" size="sm" /></div>
  );

  // 1. Data Preparation
  const storyTasks = tasks
    .filter(t => t.storyId === storyId)
    .sort((a, b) => a.position - b.position);

  const getTasksByStatus = (status: string) => storyTasks.filter(t => t.status === status);

  // 2. Drag & Drop Logic
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId as Task['status'];
    const destTasks = getTasksByStatus(newStatus);
    
    // Position Calculation
    let newPos: number;
    if (destTasks.length === 0) newPos = 1000;
    else if (destination.index === 0) newPos = destTasks[0].position / 2;
    else if (destination.index >= destTasks.length) newPos = destTasks[destTasks.length - 1].position + 1000;
    else {
      const prev = destTasks[destination.index - 1];
      const next = destTasks[destination.index];
      newPos = (prev.position + next.position) / 2;
    }

    // Object Transformation (Union Types Safety)
    let updated: Task;
    const now = new Date().toISOString();

    switch (newStatus) {
      case 'Planned':
        const { startedAt, finishedAt, ...plannedBase } = task as any;
        updated = { ...plannedBase, status: 'Planned', position: newPos } as PlannedTask;
        break;
      case 'Doing':
        const { finishedAt: _, ...doingBase } = task as any;
        updated = { ...doingBase, status: 'Doing', position: newPos, startedAt: task.startedAt || now, ownerId: task.ownerId || 'u2' } as DoingTask;
        break;
      case 'Completed':
        updated = { ...task, status: 'Completed', position: newPos, startedAt: task.startedAt || now, finishedAt: now, ownerId: task.ownerId || 'u2' } as CompletedTask;
        break;
    }

    await updateTaskInApi(updated);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container fluid className="px-0">
        <div className="kanban-wrapper pb-4 pt-2">
          {COLUMNS.map(col => (
            <div key={col} className="kanban-col">
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-body small text-uppercase">{col}</span>
                  <Badge bg="secondary-subtle" className="text-body-emphasis border border-secondary-subtle rounded-pill px-2">
                    {getTasksByStatus(col).length}
                  </Badge>
                </div>
              </div>

              {/* List */}
              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`task-container p-2 rounded-4 ${snapshot.isDraggingOver ? 'bg-secondary-subtle' : 'bg-body-tertiary'}`}
                  >
                    {getTasksByStatus(col).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => navigate(`/projects/${projectId}/stories/${storyId}/tasks/${task.id}`)}
                            className={`task-card mb-3 p-3 shadow-sm ${snapshot.isDragging ? 'dragging' : ''}`}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <AppBadge value={task.priority} />
                              <span className="text-body-secondary font-monospace small">#{task.id.slice(0, 4)}</span>
                            </div>
                            <h6 className="fw-bold text-body mb-1 text-truncate-2">{task.name}</h6>
                            <p className="text-body-secondary small mb-3 text-truncate-2">{task.description}</p>
                            <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between">
                              <div className="text-body-secondary small fw-bold"><i className="bi bi-clock me-1"></i>{task.estimatedTime}h</div>
                              <div className="user-avatar">{task.ownerId ? task.ownerId.charAt(0).toUpperCase() : '?'}</div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </Container>

      <style>{`
        .kanban-wrapper { display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; }
        .kanban-col { min-width: 85vw; scroll-snap-align: center; flex-shrink: 0; }
        
        @media (min-width: 992px) {
          .kanban-wrapper { display: grid; grid-template-columns: repeat(3, 1fr); overflow-x: visible; }
          .kanban-col { min-width: 0; }
        }

        .task-container { min-height: 65vh; border: 1px solid var(--bs-border-color-translucent); }
        .task-card { background: var(--bs-body-bg); border: 1px solid var(--bs-border-color-translucent); border-radius: 12px; cursor: pointer; }
        .task-card.dragging { border-color: var(--bs-secondary-color); z-index: 1000; }
        .task-card:hover { border-color: var(--bs-secondary-color); }
        
        .user-avatar { 
          background: var(--bs-secondary-color); color: white; width: 22px; height: 22px; 
          border-radius: 50%; display: flex; align-items: center; 
          justify-content: center; font-size: 0.65rem; font-weight: bold;
        }

        .text-truncate-2 {
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; line-height: 1.4;
        }
        
        .kanban-wrapper::-webkit-scrollbar { display: none; }
      `}</style>
    </DragDropContext>
  );
};