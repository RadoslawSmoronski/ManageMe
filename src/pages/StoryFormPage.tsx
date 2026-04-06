import { Container, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStories } from '../context/StoriesContext';
import { UserSelector } from '../components/UserSelector';
import type { StoryFormData } from '../types/story';
import { confirmDelete } from '../utils/alerts';
import type { ProgressStatus, PriorityStatus} from '../types/common';

export default function StoryFormPage() {
  const { projectId: projectId, storyId } = useParams<{ projectId: string; storyId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addStory, editStory, removeStory, stories, isLoading } = useStories();

  const isEditMode = Boolean(storyId);
  const currentStory = stories.find(s => s.id === storyId);

  const defaultStatus = currentStory?.status || (searchParams.get('status') as PriorityStatus) || "Todo";

  if (isEditMode && isLoading) {
    return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!projectId) return;

    const data = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(data.entries());

    const storyData: StoryFormData = {
      name: formValues.name as string,
      description: formValues.description as string,
      priority: formValues.priority as PriorityStatus,
      status: formValues.status as ProgressStatus,
      projectId: projectId as string,
      ownerId: formValues.ownerId as string,
      position: currentStory?.position || 0
    };

    if (isEditMode && storyId) {
      await editStory(storyId, storyData);
      navigate(`/projects/${projectId}/stories/${storyId}`);
    } else {
      await addStory(storyData);
      navigate(`/projects/${projectId}`);
    }

  };

  const handleDelete = async () => {
    if (!storyId || !projectId) return;
    
    const isConfirmed = await confirmDelete(
      'Are you sure?',
      "This story will be permanently removed from the project."
    );

    if (isConfirmed) {
      await removeStory(storyId);
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5">
      <Container style={{ maxWidth: '600px' }}>
        
        <div className="d-flex align-items-center gap-3 mb-4">
          <Button variant="link" onClick={() => navigate(-1)} className="text-dark p-0 border-0 shadow-none">
            <i className="bi bi-arrow-left fs-3"></i>
          </Button>
          <h2 className="fw-bold mb-0">{isEditMode ? 'Edit Story' : 'New Story'}</h2>
        </div>

        <Form onSubmit={handleSubmit} className="d-grid gap-4">
          
          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Story Name</label>
            <Form.Control 
              name="name" 
              required 
              defaultValue={currentStory?.name}
              placeholder="e.g. User Authentication" 
              className="py-3 rounded-3 shadow-none border-light-subtle" 
            />
          </div>

          <div>
            <UserSelector 
              label="Assigned To (Owner)" 
              name="ownerId" 
              defaultValue={currentStory?.ownerId} 
            />
          </div>

          <div>
            <label className="fw-bold small text-uppercase mb-2 text-muted">Description</label>
            <Form.Control 
              name="description" 
              as="textarea" 
              rows={4} 
              defaultValue={currentStory?.description}
              placeholder="Provide more details..." 
              className="py-3 rounded-3 shadow-none border-light-subtle" 
              style={{ resize: 'none' }}
            />
          </div>

          <Row className="g-3">
            <Col md={6}>
              <div>
                <label className="fw-bold small text-uppercase mb-2 text-muted">Priority</label>
                <Form.Select 
                  name="priority" 
                  defaultValue={currentStory?.priority || "Medium"} 
                  className="py-3 rounded-3 shadow-none cursor-pointer border-light-subtle"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </div>
            </Col>

            <Col md={6}>
              <div>
                <label className="fw-bold small text-uppercase mb-2 text-muted">Status</label>
                <Form.Select 
                  name="status" 
                  defaultValue={defaultStatus} 
                  className="py-3 rounded-3 shadow-none cursor-pointer border-light-subtle"
                >
                  <option value="Todo">To Do</option>
                  <option value="Doing">Doing</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </div>
            </Col>
          </Row>

          <div className="d-grid gap-2 pt-2">
            <Button type="submit" variant="dark" className="py-3 fw-bold rounded-3">
              {isEditMode ? 'Save Changes' : 'Create Story'}
            </Button>
            
            <Button 
              variant="link" 
              onClick={() => navigate(`/projects/${projectId}`)} 
              className="text-muted text-decoration-none small"
            >
              Discard
            </Button>

            {isEditMode && (
              <div className="mt-4 pt-4 border-top text-center">
                <Button 
                  variant="link" 
                  onClick={handleDelete}
                  className="text-danger text-decoration-none small p-0"
                >
                  Delete this story
                </Button>
              </div>
            )}
          </div>
        </Form>
      </Container>
    </div>
  );
}