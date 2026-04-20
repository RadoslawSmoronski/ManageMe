import React, { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { useUsers } from '../context/UsersContext'; 

interface UserSelectorProps {
  label: string;
  name: string;
  defaultValue?: string;
  disabled?: boolean;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ 
  label, 
  name, 
  defaultValue,
  disabled = false
}) => {
  const { users } = useUsers();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [internalId, setInternalId] = useState(defaultValue || '');

  const selectedUser = users.find(u => u.id === internalId);

  const filteredResults = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Form.Group className="position-relative">
      <Form.Label className="fw-bold small text-uppercase mb-2 text-body-secondary">{label}</Form.Label>
      
      <input type="hidden" name={name} value={internalId} />

      <Form.Control
        type="text"
        autoComplete="off"
        placeholder={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Select user..."}
        value={search}
        onChange={(e) => {
          if (disabled) return;
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (disabled) return;
          setIsOpen(true);
        }}
        className="py-3 rounded-3 shadow-none bg-body-tertiary text-body border-secondary-subtle"
        disabled={disabled}
      />

      {!disabled && isOpen && search.length > 0 && (
        <ListGroup 
          className="position-absolute w-100 z-3 shadow mt-1 overflow-auto border border-secondary-subtle rounded-3" 
          style={{ maxHeight: '200px' }}
        >
          {filteredResults.map(user => (
            <ListGroup.Item 
              key={user.id} 
              action 
              onClick={() => {
                setInternalId(user.id);
                setSearch(''); 
                setIsOpen(false);
              }}
              className="d-flex justify-content-between align-items-center bg-body text-body border-secondary-subtle"
            >
              <span>{user.firstName} {user.lastName}</span>
              <small className="text-body-secondary">{user.role}</small>
            </ListGroup.Item>
          ))}
          
          {filteredResults.length === 0 && (
            <ListGroup.Item className="text-body-secondary small text-center py-3 bg-body border-secondary-subtle">
              User not found...
            </ListGroup.Item>
          )}
        </ListGroup>
      )}
    </Form.Group>
  );
};