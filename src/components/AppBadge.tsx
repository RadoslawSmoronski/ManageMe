import { Badge } from 'react-bootstrap';
import type { ProgressStatus, PriorityStatus } from '../types/common';

interface AppBadgeProps {
  value: ProgressStatus | PriorityStatus;
}

const BADGE_CONFIG: Record<string, { bg: string; text: string }> = {
  'Doing':     { bg: 'primary-subtle', text: 'text-primary' },
  'Completed': { bg: 'success-subtle', text: 'text-success' },
  'Planned':   { bg: 'warning-subtle', text: 'text-warning-emphasis' },
  
  'High':      { bg: 'danger-subtle',  text: 'text-danger' },
  'Medium':    { bg: 'warning-subtle', text: 'text-warning-emphasis' },
  'Low':       { bg: 'info-subtle',    text: 'text-info' },
  
  'Default':   { bg: 'secondary-subtle', text: 'text-body-emphasis' },
};

export const AppBadge = ({ value }: AppBadgeProps) => {
  const config = BADGE_CONFIG[value] || BADGE_CONFIG['Default'];
  
  const isPriority = ['High', 'Medium', 'Low'].includes(value);

  if (isPriority) {
    return (
      <Badge 
        bg={config.bg} 
        className={`${config.text} border border-${config.bg} fw-bold text-uppercase px-2 py-1`}
        style={{ 
          fontSize: '0.6rem',
          letterSpacing: '0.8px',
          borderRadius: '4px', 
          display: 'inline-block'
        }}
      >
        {value}
      </Badge>
    );
  }

  return (
    <Badge 
      bg={config.bg} 
      className={`${config.text} border border-${config.bg} fw-medium rounded-pill px-3 py-2`}
      style={{ 
        fontSize: '0.75rem',
        display: 'inline-block'
      }}
    >
      {value}
    </Badge>
  );
};