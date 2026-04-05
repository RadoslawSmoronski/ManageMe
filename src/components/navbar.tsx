import { Container, Navbar, NavDropdown } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AppNavbar() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!currentUser) return null;

  const user = currentUser;
  const pathnames = location.pathname.split('/').filter((x) => x);

  console.log(pathnames);

  const truncate = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const breadcrumbs = pathnames.reduce((acc: { label: string, to: string }[], value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
    
    const isTechnical = value === 'stories' || value === 'tasks' || value === 'add' || value === 'edit';
    const isProjectsRoot = value === 'projects' && pathnames.length === 1;

    if (!isTechnical || isProjectsRoot) {
      const label = value === 'projects' ? 'Projects' : truncate(value, 3);
      acc.push({ label, to });
    }
    
    return acc;
  }, []);

  return (
    <Navbar bg="white" className="py-2 border-bottom sticky-top shadow-sm">
      <Container style={{ maxWidth: '1100px' }}>
        
        <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
          {/* LOGO */}
          <Navbar.Brand 
            onClick={() => navigate('/projects')} 
            className="fw-bold d-flex align-items-center me-0 me-md-3 border-0 bg-transparent" 
            style={{ cursor: 'pointer' }}
          >
            <i className="bi bi-layers-half text-dark fs-3"></i>
            <span className="d-none d-md-inline ms-2 fs-4 text-dark" style={{ letterSpacing: '-1px' }}>
              Manage<span className="text-muted">Me</span>
            </span>
          </Navbar.Brand>

          {/* BREADCRUMBS */}
          <div className="d-flex align-items-center overflow-hidden border-start ps-3 ms-2 ms-md-0 border-secondary-subtle">
            <nav className="d-flex align-items-center small fw-medium text-nowrap overflow-hidden">
              
              {/* Fallback dla pustej ścieżki na /projects */}
              {breadcrumbs.length === 0 && location.pathname.includes('projects') && (
                 <span className="text-dark fw-bold">Projects</span>
              )}

              {breadcrumbs.map((bc, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <div key={bc.to} className="d-flex align-items-center">
                    {index > 0 && (
                      <span className="text-muted mx-2" style={{ fontSize: '0.8rem' }}>/</span>
                    )}
                    
                    {isLast ? (
                      <span className="text-dark fw-bold text-truncate">
                        {bc.label}
                      </span>
                    ) : (
                      <span 
                        className="text-muted bc-link text-truncate" 
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
              <div className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle fw-bold shadow-sm" 
                   style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            }
            id="user-dropdown"
            className="no-caret"
          >
            <NavDropdown.Header>
              <strong>{user.firstName} {user.lastName}</strong>
            </NavDropdown.Header>
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
      `}</style>
    </Navbar>
  );
}