import { Container, Navbar, Nav } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import type { User } from '../types/user'
import { useNavigate } from 'react-router-dom';

export default function AppNavbar() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  if (!currentUser) {
    navigate('/');
    return null;
  }

  const user: User = currentUser;

  return (
    <Navbar bg="white" expand="lg" className="py-3 border-bottom sticky-top shadow-sm">
      <Container style={{ maxWidth: '1100px' }}>
        
        <Navbar.Brand 
          onClick={() => navigate('/')} 
          className="fw-bold fs-4 text-dark" 
          style={{ cursor: 'pointer', letterSpacing: '-0.5px' }}
        >
          Manage<span className="text-muted">Me</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-lg-4">
            <Nav.Link onClick={() => navigate('/projects')} className="fw-semibold text-dark px-3">
              Projects
            </Nav.Link>
          </Nav>

          {/* User Profile */}
          <div className="user-profile-section d-flex flex-column flex-lg-row align-items-center gap-3 ms-lg-3 my-3 my-lg-0 pt-3 pt-lg-0">
            
            <div className="text-center text-lg-end">
              <div className="fw-bold small text-dark" style={{ lineHeight: '1.2' }}>
                {user.firstName} {user.lastName}
              </div>
              <div className="text-muted" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Team Member
              </div>
            </div>

            <div 
              className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle fw-bold shadow-sm" 
              style={{ width: '42px', height: '42px', fontSize: '0.9rem', flexShrink: 0, userSelect: 'none' }}
            >
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>

        </Navbar.Collapse>
      </Container>

      <style>{`
        .nav-link { transition: 0.2s opacity; cursor: pointer; }
        .nav-link:hover { opacity: 0.7; }

        .user-profile-section {
            border-top: 1px solid #dee2e6; /* Linia widoczna domyślnie (Mobile) */
        }

        @media (min-width: 992px) {
            .user-profile-section {
            border-top: none !important; /* Całkowite usunięcie linii na Desktopie */
            }
      `}</style>
    </Navbar>
  );
}