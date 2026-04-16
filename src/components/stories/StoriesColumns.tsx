import { useState } from 'react';
import { Container, Badge, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { Story } from '../../types/story';
import type { ProgressStatus } from '../../types/common';
import { AppBadge } from '../AppBadge';

interface StoriesColumnsProps {
  projectId: string;
  projectStories: Story[];
  isLoading: boolean;
}

const COLUMNS = ["Planned", "Doing", "Completed"] as ProgressStatus[];
type SortOption = 'priorityDesc' | 'priorityAsc' | 'nameAsc' | 'nameDesc';

export const StoriesColumns = ({ projectId, projectStories, isLoading }: StoriesColumnsProps) => {
  const navigate = useNavigate();
  const [columnSort, setColumnSort] = useState<Record<ProgressStatus, SortOption>>({
    Planned: 'priorityDesc',
    Doing: 'priorityDesc',
    Completed: 'priorityDesc',
  });
  const priorityWeights: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="dark" size="sm" />
      </div>
    );
  }

  const getStoriesByStatus = (status: ProgressStatus) => 
    projectStories
      .filter(story => story.status === status)
      .sort((a, b) => {
        if (columnSort[status] === 'nameAsc') {
          return a.name.localeCompare(b.name);
        }

        if (columnSort[status] === 'nameDesc') {
          return b.name.localeCompare(a.name);
        }

        if (columnSort[status] === 'priorityAsc') {
          return (priorityWeights[a.priority] || 0) - (priorityWeights[b.priority] || 0) || (a.position - b.position);
        }

        return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0) || (a.position - b.position);
      });

  const handleColumnSortChange = (status: ProgressStatus, value: SortOption) => {
    setColumnSort((prev) => ({
      ...prev,
      [status]: value,
    }));
  };

  return (
    <Container fluid className="px-0">
      <div className="stories-responsive-layout pb-4 pt-2">
        {COLUMNS.map((col) => {
          const filteredStories = getStoriesByStatus(col);
          
          return (
            <div key={col} className="story-column-wrapper">
              <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-dark small text-uppercase" style={{ letterSpacing: '0.5px' }}>
                    {col}
                  </span>
                  <Badge bg="dark" className="rounded-pill px-2 py-1" style={{ fontSize: '0.6rem' }}>
                    {filteredStories.length}
                  </Badge>
                </div>
                <Form.Select
                  size="sm"
                  value={columnSort[col]}
                  onChange={(e) => handleColumnSortChange(col, e.target.value as SortOption)}
                  className="rounded-3 shadow-none border-light-subtle"
                  style={{ maxWidth: '170px' }}
                >
                  <option value="priorityDesc">Priority high to low</option>
                  <option value="priorityAsc">Priority low to high</option>
                  <option value="nameAsc">Name A to Z</option>
                  <option value="nameDesc">Name Z to A</option>
                </Form.Select>
              </div>

              <div className="stories-list-container">
                {filteredStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => navigate(`/projects/${projectId}/stories/${story.id}`)}
                    className="story-minimal-card mb-3 p-3 shadow-sm"
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                       <AppBadge value={story.priority} /> 
                       <span className="text-muted font-monospace" style={{ fontSize: '0.65rem' }}>
                        #{story.id.slice(0, 4)}
                       </span>
                    </div>
                    
                    <h6 className="fw-bold text-dark mb-2 text-truncate-2" style={{ fontSize: '0.95rem' }}>
                      {story.name}
                    </h6>
                    
                    <p className="text-muted small mb-3 text-truncate-2" style={{ fontSize: '0.85rem' }}>
                      {story.description}
                    </p>
                    
                    <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.65rem' }}>
                        <i className="bi bi-list-task"></i>
                        <span className="fw-bold text-uppercase">Tasks: 0/5</span>
                      </div>
                      <div className="bg-dark rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 20, height: 20, fontSize: '0.6rem' }}>
                        {story.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStories.length === 0 && (
                    <div className="text-center py-5 text-muted small italic">No stories here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        /* BAZA: MOBILKA (Scroll na boki) */
        .stories-responsive-layout {
          display: flex;
          gap: 1.25rem;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding-left: 10px;
          padding-right: 10px;
          scrollbar-width: none;
        }

        .stories-responsive-layout::-webkit-scrollbar {
          display: none;
        }

        .story-column-wrapper {
          min-width: 85vw;
          scroll-snap-align: center;
          flex-shrink: 0;
        }

        /* DESKTOP: PEŁNA SZEROKOŚĆ I WYRÓWNANIE */
        @media (min-width: 992px) {
          .stories-responsive-layout {
            display: grid;
            grid-template-columns: repeat(3, 1fr); 
            gap: 1.5rem;
            overflow-x: visible;
            padding-left: 0;
            padding-right: 0;
          }

          .story-column-wrapper {
            min-width: 0;
          }
        }

        /* KARTA STORY */
        .story-minimal-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .story-minimal-card:active {
          transform: scale(0.98);
        }

        @media (hover: hover) {
          .story-minimal-card:hover {
            border-color: #212529;
            box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
            transform: translateY(-2px);
          }
        }

        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }
      `}</style>
    </Container>
  );
};