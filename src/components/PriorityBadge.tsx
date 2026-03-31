import { Badge } from 'react-bootstrap';
import type { Priority } from '../types/priority';

interface PriorityBadgeProps {
  priority: Priority
  pill?: boolean;
}

export const PriorityBadge = ({ priority, pill = true }: PriorityBadgeProps) => {
  const colors = { 
    High: 'danger', 
    Medium: 'warning', 
    Low: 'info' 
  };

  return (
    <Badge 
      bg={colors[priority]} 
      pill={pill}
      className="small fw-bold text-uppercase" 
      style={{ 
        fontSize: '0.6rem',
        letterSpacing: '0.5px',
        padding: '0.4em 0.8em'
      }}
    >
      {priority}
    </Badge>
  );
};