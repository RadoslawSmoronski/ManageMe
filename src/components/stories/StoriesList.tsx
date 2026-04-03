import React, { useState, useMemo } from 'react';
import { Table, Spinner, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useStories } from '../../context/StoriesContext';
import { AppBadge } from '../AppBadge';
import type { ProgressStatus } from '../../types/common';

interface StoriesListProps {
  projectId: string;
}

type SortKeys = 'id' | 'name' | 'priority' | 'status';
type SortOrder = 'asc' | 'desc';

export const StoriesList = ({ projectId }: StoriesListProps) => {
  const navigate = useNavigate();
  const { getProjectStories, isLoading } = useStories();
  const projectStories = getProjectStories(projectId);

  const [sortConfig, setSortConfig] = useState<{ key: SortKeys; order: SortOrder }>({
    key: 'name',
    order: 'asc'
  });

  const priorityWeights: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
  const statusWeights: Record<ProgressStatus, number> = { Planned: 1, Doing: 2, Completed: 3 };

  const sortedStories = useMemo(() => {
    const sortableItems = [...projectStories];
    
    sortableItems.sort((a, b) => {
      let aValue: string | number = a[sortConfig.key];
      let bValue: string | number = b[sortConfig.key];

      if (sortConfig.key === 'priority') {
        aValue = priorityWeights[a.priority] || 0;
        bValue = priorityWeights[b.priority] || 0;
      } 
      else if (sortConfig.key === 'status') {
        aValue = statusWeights[a.status] || 0;
        bValue = statusWeights[b.status] || 0;
      }
      else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });

    return sortableItems;
  }, [projectStories, sortConfig]);

  const requestSort = (key: SortKeys) => {
    let order: SortOrder = 'asc';
    if (sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    }
    setSortConfig({ key, order });
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="dark" size="sm" />
      </div>
    );
  }

  const getSortIcon = (key: SortKeys) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up ms-2 opacity-25"></i>;
    return sortConfig.order === 'asc' 
      ? <i className="bi bi-sort-down ms-2 text-dark"></i> 
      : <i className="bi bi-sort-up ms-2 text-dark"></i>;
  };

  return (
    <Container fluid className="px-0 py-2">
      <div className="table-responsive rounded-3 border bg-white shadow-sm overflow-hidden">
        <Table hover className="align-middle mb-0 custom-stories-table">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 text-muted small text-uppercase fw-bold sortable-header" onClick={() => requestSort('id')}>
                ID {getSortIcon('id')}
              </th>
              <th className="py-3 text-muted small text-uppercase fw-bold sortable-header" onClick={() => requestSort('name')}>
                Story Name {getSortIcon('name')}
              </th>
              <th className="py-3 text-muted small text-uppercase fw-bold sortable-header" onClick={() => requestSort('priority')}>
                Priority {getSortIcon('priority')}
              </th>
              <th className="py-3 text-muted small text-uppercase fw-bold sortable-header" onClick={() => requestSort('status')}>
                Status {getSortIcon('status')}
              </th>
              <th className="py-3 text-muted small text-uppercase fw-bold text-end pe-4">Tasks</th>
            </tr>
          </thead>
          <tbody>
            {sortedStories.length > 0 ? (
              sortedStories.map((story) => (
                <tr 
                  key={story.id} 
                  onClick={() => navigate(`/projects/${projectId}/stories/${story.id}`)}
                  className="animate-row"
                >
                  <td className="ps-4 font-monospace text-muted small" style={{ fontSize: '0.8rem' }}>
                    #{story.id.slice(0, 4)}
                  </td>
                  <td>
                    <div className="fw-bold text-dark">{story.name}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '350px' }}>
                      {story.description}
                    </div>
                  </td>
                  <td><AppBadge value={story.priority} /></td>
                  <td><AppBadge value={story.status} /></td>
                  <td className="text-end pe-4">
                    <span className="fw-bold small text-dark me-2">0/5</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="text-center py-5 text-muted">No stories found.</td></tr>
            )}
          </tbody>
        </Table>
      </div>

      <style>{`
        .sortable-header {
          cursor: pointer;
          user-select: none;
          transition: background-color 0.1s ease;
        }
        .sortable-header:hover {
          background-color: #f1f1f1 !important;
        }
        .custom-stories-table td {
          padding-top: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f8f9fa;
        }
        .animate-row {
          cursor: pointer;
        }
        .animate-row:hover {
          background-color: #fbfbfb !important;
        }
      `}</style>
    </Container>
  );
};