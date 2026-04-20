import { Container, Navbar, NavDropdown } from 'react-bootstrap';
import { useUsers } from '../context/UsersContext';
import { useProjects } from '../context/ProjectsContext';
import { useStories } from '../context/StoriesContext';
import { useTasks } from '../context/TasksContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function AppNavbar() {
  const { currentUser, loadUsers, hasLoaded: hasUsersLoaded, isLoading: isUsersLoading } = useUsers();
  const { projects} = useProjects();
  const { stories} = useStories();
  const { tasks} = useTasks();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!hasUsersLoaded && !isUsersLoading) {
      loadUsers();
    }
  }, [hasUsersLoaded, isUsersLoading, loadUsers]);

  if (!currentUser) return null;

  const user = currentUser;
  const pathnames = location.pathname.split('/').filter((x) => x);

  const truncate = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const initials = `${firstName?.trim().charAt(0) ?? ''}${lastName?.trim().charAt(0) ?? ''}`.toUpperCase();
    return initials || 'U';
  };

  const breadcrumbs: { label: string; to: string }[] = [];

  if (pathnames[0] === 'projects') {
    breadcrumbs.push({ label: 'Projects', to: '/projects' });
  }

  const projectIdFromEditRoute = pathnames[1] === 'edit' ? pathnames[2] : undefined;
  const projectId = projectIdFromEditRoute ?? pathnames[1];
  if (projectId && projectId !== 'new' && projectId !== 'edit') {
    const project = projects.find((item) => item.id === projectId);
    breadcrumbs.push({
      label: project ? truncate(project.name, 24) : truncate(projectId, 12),
      to: `/projects/${projectId}`,
    });
  }

  const storiesIdx = pathnames.indexOf('stories');
  if (storiesIdx >= 0) {
    const storySegment = pathnames[storiesIdx + 1];
    const storyId = storySegment === 'edit' ? pathnames[storiesIdx + 2] : storySegment;
    if (storyId && storyId !== 'add' && storyId !== 'edit') {
      const story = stories.find((item) => item.id === storyId);
      breadcrumbs.push({
        label: story ? truncate(story.name, 24) : truncate(storyId, 12),
        to: `/projects/${projectId}/stories/${storyId}`,
      });
    }
  }

  const tasksIdx = pathnames.indexOf('tasks');
  if (tasksIdx >= 0) {
    const taskSegment = pathnames[tasksIdx + 1];
    const taskId = taskSegment === 'edit' ? pathnames[tasksIdx + 2] : taskSegment;
    const storyId = storiesIdx >= 0 ? pathnames[storiesIdx + 1] : undefined;
    if (taskId && taskId !== 'add' && taskId !== 'edit') {
      const task = tasks.find((item) => item.id === taskId);
      breadcrumbs.push({
        label: task ? truncate(task.name, 24) : truncate(taskId, 12),
        to: `/projects/${projectId}/stories/${storyId}/tasks/${taskId}`,
      });
    }
  }

  return (
    <Navbar className="py-2 border-bottom bg-body sticky-top shadow-sm">
      <Container style={{ maxWidth: '1100px' }}>
        
        <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
          {/* LOGO */}
          <Navbar.Brand 
            onClick={() => navigate('/projects')} 
            className="fw-bold d-flex align-items-center me-0 me-md-3 border-0 bg-transparent" 
            style={{ cursor: 'pointer' }}
          >
            <i className="bi bi-layers-half fs-3"></i>
            <span className="d-none d-md-inline ms-2 fs-4 text-body" style={{ letterSpacing: '-1px' }}>
              Manage<span className="text-body-secondary">Me</span>
            </span>
          </Navbar.Brand>

          {/* BREADCRUMBS */}
          <div className="d-flex align-items-center overflow-hidden border-start ps-3 ms-2 ms-md-0 border-secondary-subtle">
            <nav className="d-flex align-items-center small fw-medium text-nowrap overflow-hidden">
              
              {/* Fallback dla pustej ścieżki na /projects */}
              {breadcrumbs.length === 0 && location.pathname.includes('projects') && (
                 <span className="text-body fw-bold">Projects</span>
              )}

              {breadcrumbs.map((bc, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <div key={bc.to} className="d-flex align-items-center">
                    {index > 0 && (
                      <span className="text-body-secondary mx-2" style={{ fontSize: '0.8rem' }}>/</span>
                    )}
                    
                    {isLast ? (
                      <span className="text-body fw-bold text-truncate">
                        {bc.label}
                      </span>
                    ) : (
                      <span 
                        className="text-body-secondary bc-link text-truncate" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(bc.to)}
                      >
                        {bc.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* PROFIL */}
        <div className="ms-3 d-flex align-items-center">
          <NavDropdown
            align="end"
            title={
              <div
                className="d-flex align-items-center justify-content-center user-avatar rounded-circle fw-bold shadow-sm"
                style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}
              >
                {getUserInitials(user.firstName, user.lastName)}
              </div>
            }
            id="user-dropdown"
            className="no-caret"
          >
            <NavDropdown.Header>
              <strong>{user.firstName} {user.lastName}</strong>
            </NavDropdown.Header>
            <NavDropdown.Header className="text-body-secondary small">
              Appearance
            </NavDropdown.Header>
            <NavDropdown.Item onClick={() => setTheme('system')}>
              <i className="bi bi-circle-half me-2"></i>
              System {theme === 'system' && `(${resolvedTheme})`}
              {theme === 'system' && <i className="bi bi-check2 ms-2"></i>}
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => setTheme('light')}>
              <i className="bi bi-sun me-2"></i>
              Light
              {theme === 'light' && <i className="bi bi-check2 ms-2"></i>}
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => setTheme('dark')}>
              <i className="bi bi-moon me-2"></i>
              Dark
              {theme === 'dark' && <i className="bi bi-check2 ms-2"></i>}
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className="text-danger">
               <i className="bi bi-box-arrow-right me-2"></i> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </div>

      </Container>

      <style>{`
        .bc-link:hover { color: #0d6efd !important; text-decoration: underline; }
        .no-caret .dropdown-toggle::after { display: none; }
        .user-avatar {
          background: var(--bs-secondary-bg-subtle);
          color: var(--bs-body-color);
          border: 1px solid var(--bs-border-color-translucent);
        }
      `}</style>
    </Navbar>
  );
}