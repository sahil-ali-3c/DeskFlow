import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { PRIORITIES, PRIORITY_COLORS } from '../../utils/constants';
import { validateTicketForm } from '../../utils/helpers';

const INITIAL_FORM = {
  subject: '',
  description: '',
  customerEmail: '',
  priority: 'medium'
};

/**
 * Create ticket modal with form validation
 * @param {{ isOpen: boolean, onClose: Function, onSubmit: Function }} props
 */
export default function CreateTicketModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setSubmitError('');
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: validationErrors } = validateTicketForm(form);
    if (validationErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ subject: true, description: true, customerEmail: true, priority: true });

    const { isValid, errors: validationErrors } = validateTicketForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      const success = await onSubmit(form);
      if (success) {
        setForm({ ...INITIAL_FORM });
        setErrors({});
        setTouched({});
        onClose();
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ ...INITIAL_FORM });
    setErrors({});
    setTouched({});
    setSubmitError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Ticket">
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {/* Subject */}
          <div className="form-group">
            <label htmlFor="ticket-subject">Subject</label>
            <input
              id="ticket-subject"
              type="text"
              className={`input ${touched.subject && errors.subject ? 'input-error' : ''}`}
              placeholder="Brief description of the issue"
              value={form.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              onBlur={() => handleBlur('subject')}
              disabled={loading}
            />
            {touched.subject && errors.subject && (
              <span className="error-text">{errors.subject}</span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="ticket-description">Description</label>
            <textarea
              id="ticket-description"
              className={`textarea ${touched.description && errors.description ? 'input-error' : ''}`}
              placeholder="Provide detailed information about the issue..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              disabled={loading}
              rows={4}
            />
            {touched.description && errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          {/* Customer Email */}
          <div className="form-group">
            <label htmlFor="ticket-email">Customer Email</label>
            <input
              id="ticket-email"
              type="email"
              className={`input ${touched.customerEmail && errors.customerEmail ? 'input-error' : ''}`}
              placeholder="customer@example.com"
              value={form.customerEmail}
              onChange={(e) => handleChange('customerEmail', e.target.value)}
              onBlur={() => handleBlur('customerEmail')}
              disabled={loading}
            />
            {touched.customerEmail && errors.customerEmail && (
              <span className="error-text">{errors.customerEmail}</span>
            )}
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="ticket-priority">Priority</label>
            <div className="priority-select-wrapper">
              <select
                id="ticket-priority"
                className={`select ${touched.priority && errors.priority ? 'input-error' : ''}`}
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                onBlur={() => handleBlur('priority')}
                disabled={loading}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
              <div
                className="priority-color-indicator"
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: PRIORITY_COLORS[form.priority],
                  position: 'absolute',
                  right: '44px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  boxShadow: `0 0 6px ${PRIORITY_COLORS[form.priority]}`
                }}
              />
            </div>
            {touched.priority && errors.priority && (
              <span className="error-text">{errors.priority}</span>
            )}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="error-text" style={{ fontSize: '0.875rem' }}>
              ⚠ {submitError}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Create Ticket
          </Button>
        </div>
      </form>

      <style>{`
        .priority-select-wrapper {
          position: relative;
        }
      `}</style>
    </Modal>
  );
}
