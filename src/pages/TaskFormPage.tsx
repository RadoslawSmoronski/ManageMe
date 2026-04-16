import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useTasks } from '../context/TasksContext';
import { useUsers } from '../context/UsersContext';
import type { Task, PlannedTask, DoingTask, CompletedTask } from '../types/task';
import type { PriorityStatus } from '../types/common';
import { confirmDelete, successToast } from '../utils/alerts';
import { UserSelector } from '../components/UserSelector';

export default function TaskFormPage() {
  const { projectId, storyId, taskId } = useParams<{ projectId: string; storyId: string; taskId?: string }>();
  const navigate = useNavigate();
  const { users } = useUsers();
  const { tasks, isLoading, loadTasks, addTask, updateTaskInApi, deleteTask } = useTasks();

  const isCreateMode = !taskId;
  const [isEditMode, setIsEditMode] = useState(isCreateMode);

  useEffect(() => {
    if (!isCreateMode) {
      loadTasks();
    }
  }, [isCreateMode, loadTasks]);

  const currentTask = tasks.find((task) => task.id === taskId);
  const isViewMode = !isCreateMode && !isEditMode;

  if (!projectId || !storyId) {
    return null;
  }

  if (!isCreateMode && isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  if (!isCreateMode && !currentTask) {
    return (
      <Container className="py-5 text-center">
        <h3 className="fw-bold">Task not found</h3>
        <Button
          variant="dark"
          onClick={() => navigate(`/projects/${projectId}/stories/${storyId}`)}
          className="mt-3 rounded-3"
        >
          Back to Story
        </Button>
      </Container>
    );
  }

  const buildUpdatedTask = (
    baseTask: Task,
    formValues: {
      name: string;
      description: string;
      priority: PriorityStatus;
      estimatedTime: number;
      status: Task['status'];
      ownerId?: string;
    }
  ): Task => {
    const sharedData = {
      id: baseTask.id,
      storyId: baseTask.storyId,
      createdAt: baseTask.createdAt,
      position: baseTask.position,
      name: formValues.name,
      description: formValues.description,
      priority: formValues.priority,
      estimatedTime: formValues.estimatedTime,
    };

    if (formValues.status === 'Planned') {
      const plannedTask: PlannedTask = {
        ...sharedData,
        status: 'Planned',
        ...(formValues.ownerId ? { ownerId: formValues.ownerId } : {}),
      };
      return plannedTask;
    }

    const ownerId = formValues.ownerId || baseTask.ownerId || users[0]?.id || '';
    const startedAt = baseTask.status === 'Planned' ? new Date().toISOString() : baseTask.startedAt;

    if (formValues.status === 'Doing') {
      const doingTask: DoingTask = {
        ...sharedData,
        status: 'Doing',
        ownerId,
        startedAt,
      };
      return doingTask;
    }

    const completedTask: CompletedTask = {
      ...sharedData,
      status: 'Completed',
      ownerId,
      startedAt,
      finishedAt: baseTask.status === 'Completed' ? baseTask.finishedAt : new Date().toISOString(),
    };
    return completedTask;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(isViewMode) {
      setIsEditMode(true);
      return;
    }

    const data = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(data.entries());

    const parsedData = {
      name: formValues.name as string,
      description: formValues.description as string,
      priority: formValues.priority as PriorityStatus,
      estimatedTime: Number(formValues.estimatedTime),
      status: (formValues.status as Task['status']) || 'Planned',
      ownerId: (formValues.ownerId as string) || undefined,
    };

    if (isCreateMode) {
      await addTask({
        name: parsedData.name,
        description: parsedData.description,
        priority: parsedData.priority,
        storyId,
        estimatedTime: parsedData.estimatedTime,
        position: tasks.filter((task) => task.storyId === storyId).length * 1000 + 1000,
        ...(parsedData.ownerId ? { ownerId: parsedData.ownerId } : {}),
      });
      navigate(`/projects/${projectId}/stories/${storyId}`);
      return;
    }

    if (!currentTask) return;

    const hasNoChanges =
      parsedData.name === currentTask.name &&
      parsedData.description === currentTask.description &&
      parsedData.priority === currentTask.priority &&
      parsedData.estimatedTime === currentTask.estimatedTime &&
      parsedData.status === currentTask.status &&
      (parsedData.ownerId || '') === (currentTask.ownerId || '');

    if (hasNoChanges) {
      setIsEditMode(false);
      return;
    }

    const updatedTask = buildUpdatedTask(currentTask, parsedData);
    await updateTaskInApi(updatedTask);
    setIsEditMode(false);
    await successToast('Task has been updated');
  };

  const handleDelete = async () => {
    if (!taskId) return;

    const isConfirmed = await confirmDelete(
      'Are you sure?',
      'This task will be permanently removed from this story.'
    );

    if (isConfirmed) {
      await deleteTask(taskId);
      navigate(`/projects/${projectId}/stories/${storyId}`);
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: '600px' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <Button
            variant="link"
            onClick={() => navigate(`/projects/${projectId}/stories/${storyId}`)}
            className="text-dark p-0 border-0 shadow-none"
          >
            <i className="bi bi-arrow-left fs-3"></i>
          </Button>
          <h2 className="fw-bold mb-0">
            {isCreateMode ? 'New Task' : isViewMode ? `Task Preview (${currentTask?.name})` : `Edit Task (${currentTask?.name})`}
          </h2>
        </div>

        <Form onSubmit={handleSubmit} className="d-grid gap-4">
          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Task Name</label>
            <Form.Control
              name="name"
              required
              defaultValue={currentTask?.name || ''}
              placeholder="e.g. Add login form validation"
              className="py-3 rounded-3 shadow-none border-light-subtle"
              disabled={isViewMode}
            />
          </div>

          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Description</label>
            <Form.Control
              name="description"
              as="textarea"
              rows={4}
              defaultValue={currentTask?.description || ''}
              placeholder="Provide implementation details..."
              className="py-3 rounded-3 shadow-none border-light-subtle"
              style={{ resize: 'none' }}
              disabled={isViewMode}
            />
          </div>

          <Row className="g-3">
            <Col md={6}>
              <div>
                <label className="fw-bold small text-uppercase mb-2 text-muted">Priority</label>
                <Form.Select
                  name="priority"
                  defaultValue={currentTask?.priority || 'Low'}
                  className="py-3 rounded-3 shadow-none cursor-pointer border-light-subtle"
                  disabled={isViewMode}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label className="fw-bold small text-uppercase mb-2 text-muted">Estimated Time (hours)</label>
                <Form.Control
                  name="estimatedTime"
                  type="number"
                  min={1}
                  required
                  defaultValue={currentTask?.estimatedTime || 1}
                  className="py-3 rounded-3 shadow-none border-light-subtle"
                  disabled={isViewMode}
                />
              </div>
            </Col>
          </Row>

          <Row className="g-3">
            <Col md={6}>
              <div>
                <label className="fw-bold small text-uppercase mb-2 text-muted">Status</label>
                <Form.Select
                  name="status"
                  defaultValue={currentTask?.status || 'Planned'}
                  className="py-3 rounded-3 shadow-none cursor-pointer border-light-subtle"
                  disabled={isViewMode || isCreateMode}
                >
                  <option value="Planned">Planned</option>
                  <option value="Doing">Doing</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </div>
            </Col>

            <Col md={6}>
              <UserSelector
                label="Owner"
                name="ownerId"
                defaultValue={currentTask?.ownerId || ''}
                disabled={isViewMode}
              />
            </Col>
          </Row>

          <div className="d-grid gap-2 pt-2">
            {isCreateMode ? (
              <Button type="submit" variant="dark" className="py-3 fw-bold rounded-3">
                Create Task
              </Button>
            ) : (
              <Button
                type="submit"
                variant="dark"
                className="py-3 fw-bold rounded-3"
              >
                {isViewMode ? 'Edit' : 'Save Changes'}
              </Button>
            )}

            {!isCreateMode && (
              <div className="mt-4 pt-4 border-top text-center">
                <Button
                  variant="link"
                  onClick={handleDelete}
                  className="text-danger text-decoration-none small p-0"
                >
                  Delete this task
                </Button>
              </div>
            )}
          </div>
        </Form>
      </Container>
    </div>
  );
}
