import { Table } from 'react-bootstrap';
import type { Project } from '../../types/project';
import { useNavigate } from 'react-router-dom';
import { AppBadge } from '../AppBadge';
import { confirmDelete } from '../../utils/alerts';

export interface ProjectsDesktopListProps {
  projects: Project[];
  removeProject: (id: string) => void;
}

export default function ProjectsDesktopList({ projects, removeProject }: ProjectsDesktopListProps) {
    const navigate = useNavigate();

    const handleDeleteClick = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();

        const isConfirmed = await confirmDelete(
            "Delete Project?", 
            `Are you sure you want to delete "${name}"? This action is permanent.`
        );

        if (isConfirmed) {
            removeProject(id);
        }
    };

    return (
        <div className="d-none d-lg-block">
            
            <style>{`
                .delete-btn { 
                    opacity: 0; 
                    transition: opacity 0.2s ease-in-out; 
                }
                .pointer-row:hover .delete-btn { 
                    opacity: 1; 
                }
                .pointer-row {
                    cursor: pointer;
                }
            `}</style>

            <Table hover className="align-middle border-top border-secondary-subtle">
                <thead>
                    <tr className="text-body-secondary small">
                        <th className="py-3 border-0 ps-4">NAME</th>
                        <th className="py-3 border-0">DESCRIPTION</th>
                        <th className="py-3 border-0 text-center">STATUS</th>
                        <th className="py-3 border-0 pe-4 text-end"></th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((p) => (
                        <tr 
                            key={p.id} 
                            className="pointer-row" 
                            onClick={() => navigate(`/projects/${p.id}`)}
                        >
                            <td className="py-4 ps-4">
                                <span className="fw-bold d-block mb-1 text-body">{p.name}</span>
                                <span className="text-body-secondary small uppercase">ID-{p.id.slice(0, 5)}</span>
                            </td>
                            <td className="py-4 text-body-secondary small pe-5">
                                <div className="text-truncate" style={{ maxWidth: '350px' }}>
                                    {p.description}
                                </div>
                            </td>
                            <td className="py-4 text-center">
                                <AppBadge value={p.status} />
                            </td>
                            <td className="py-4 text-end pe-4" onClick={(e) => e.stopPropagation()}>
                                <button 
                                    className="btn btn-link text-danger p-2 delete-btn shadow-none border-0"
                                    onClick={(e) => handleDeleteClick(e, p.id, p.name)}
                                    title="Delete project"
                                >
                                    <i className="bi bi-trash fs-5"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}