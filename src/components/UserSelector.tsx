import React, { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { useUser } from '../context/UserContext'; 

interface UserSelectorProps {
  label: string;
  onSelect: (userId: string) => void;
  selectedUserId?: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ label, onSelect, selectedUserId }) => {
  const { users } = useUser(); 
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredResults = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <Form.Group className="mb-3 position-relative">
      <Form.Label className="fw-bold">{label}</Form.Label>
      
      <Form.Control
        type="text"
        placeholder={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Type name..."}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && search.length > 0 && (
        <ListGroup className="position-absolute w-100 z-3 shadow mt-1">
          {filteredResults.map(user => (
            <ListGroup.Item 
              key={user.id} 
              action 
              onClick={() => {
                onSelect(user.id);
                setSearch(''); 
                setIsOpen(false);
              }}
            >
              {user.firstName} {user.lastName} <small className="text-muted">({user.role})</small>
            </ListGroup.Item>
          ))}
          {filteredResults.length === 0 && (
            <ListGroup.Item className="text-muted">No users found</ListGroup.Item>
          )}
        </ListGroup>
      )}
      
      {selectedUser && !search && (
        <div className="mt-1 small text-success">
          Selected: <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>
        </div>
      )}
    </Form.Group>
  );
};