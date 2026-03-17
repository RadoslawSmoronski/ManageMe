import { Badge } from 'react-bootstrap';
import type { ProjectStatus } from '../../types/project';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  'In Progress': { bg: 'primary-subtle', text: 'text-primary' },
  'Completed':   { bg: 'success-subtle', text: 'text-success' },
  'Planned':     { bg: 'warning-subtle', text: 'text-warning-emphasis' },
  'Default':     { bg: 'light',          text: 'text-dark' },
};

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Default'];

  return (
    <Badge 
      bg={config.bg} 
      className={`${config.text} border border-${config.bg} rounded-pill px-3 py-2 fw-medium`}
    >
      {status}
    </Badge>
  );
};