import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ResourceFieldDefinition } from '../types/product';
import { useToast } from '../hooks/useToast';
import {
  getResourceFields,
  createResourceField,
  updateResourceField,
  deleteResourceField,
  reorderResourceFields,
} from '../services/productService';

interface ResourceFieldBuilderProps {
  productType: 'package' | 'campaign';
  productId: number;
}

// Sortable Field Item Component
interface SortableFieldItemProps {
  field: ResourceFieldDefinition;
  onEdit: (field: ResourceFieldDefinition) => void;
  onDelete: (fieldId: number) => void;
}

function SortableFieldItem({ field, onEdit, onDelete }: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-dark-hover border border-dark-border rounded-lg p-4 mb-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-text-muted hover:text-text"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-text">{field.field_name}</h4>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  field.field_type === 'image'
                    ? 'bg-purple-500/20 text-purple-400'
                    : field.field_type === 'document'
                    ? 'bg-primary/20 text-primary'
                    : field.field_type === 'number'
                    ? 'bg-success/20 text-success'
                    : 'bg-dark-border text-text-muted'
                }`}
              >
                {field.field_type}
              </span>
              {field.is_required && (
                <span className="text-xs text-danger font-medium">Required</span>
              )}
            </div>
            {field.help_text && (
              <p className="text-sm text-text-muted mt-1">{field.help_text}</p>
            )}
            <div className="text-xs text-text-muted mt-2 flex flex-wrap gap-3">
              {field.max_file_size_mb && (
                <span>Max size: {field.max_file_size_mb}MB</span>
              )}
              {field.max_length && <span>Max length: {field.max_length}</span>}
              {field.min_value !== null && field.min_value !== undefined && (
                <span>Min: {field.min_value}</span>
              )}
              {field.max_value !== null && field.max_value !== undefined && (
                <span>Max: {field.max_value}</span>
              )}
              {field.allowed_extensions && field.allowed_extensions.length > 0 && (
                <span>Allowed: {field.allowed_extensions.join(', ')}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(field)}
            className="text-primary hover:text-primary/80 text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(field.id)}
            className="text-danger hover:text-danger/80 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const ResourceFieldBuilder = ({ productType, productId }: ResourceFieldBuilderProps) => {
  const { showSuccess, showError: showErrorToast } = useToast();
  const [fields, setFields] = useState<ResourceFieldDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState<ResourceFieldDefinition | null>(null);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchFields();
  }, [productType, productId]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const data = await getResourceFields(productType, productId);
      setFields(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load resource fields');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex(field => field.id.toString() === active.id);
    const newIndex = fields.findIndex(field => field.id.toString() === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const newFields = [...fields];
    const [movedField] = newFields.splice(oldIndex, 1);
    newFields.splice(newIndex, 0, movedField);
    setFields(newFields);

    try {
      setReordering(true);
      const fieldIds = newFields.map(field => field.id);
      await reorderResourceFields(fieldIds);
      showSuccess('Fields reordered successfully');
    } catch (err: any) {
      console.error('Reorder error:', err);
      // Check if it's a 400 or 404 error (endpoint not implemented)
      if (err.response?.status === 400 || err.response?.status === 404) {
        showErrorToast('Reorder feature not yet implemented in backend. Order saved locally only.');
        // Keep the new order in UI even though backend doesn't support it yet
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to reorder fields';
        showErrorToast(errorMsg);
        // Revert on other failures
        await fetchFields();
      }
    } finally {
      setReordering(false);
    }
  };

  const handleDelete = async (fieldId: number) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      await deleteResourceField(fieldId);
      await fetchFields();
      showSuccess('Field deleted successfully');
      setError(''); // Clear any previous errors
    } catch (err: any) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete field';
      setError(errorMessage);
      showErrorToast(errorMessage);
    }
  };

  const handleEdit = (field: ResourceFieldDefinition) => {
    setEditingField(field);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingField(null);
  };

  const handleFormSuccess = () => {
    fetchFields();
    handleFormClose();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-text-muted">Loading fields...</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text">Resource Fields</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 text-sm shadow-glow-primary"
        >
          + Add Field
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-danger/20 border border-danger rounded-lg text-danger px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {fields.length === 0 ? (
        <p className="text-text-muted text-center py-8">
          No resource fields configured. Add fields to collect information from users.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields.map(f => f.id.toString())} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {fields.map((field) => (
                <SortableFieldItem
                  key={field.id}
                  field={field}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {reordering && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-primary">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm">Reordering fields...</span>
          </div>
        </div>
      )}

      {showForm && (
        <ResourceFieldForm
          productType={productType}
          productId={productId}
          field={editingField}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

interface ResourceFieldFormProps {
  productType: 'package' | 'campaign';
  productId: number;
  field: ResourceFieldDefinition | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ResourceFieldForm = ({
  productType,
  productId,
  field,
  onClose,
  onSuccess,
}: ResourceFieldFormProps) => {
  const [formData, setFormData] = useState({
    field_name: field?.field_name || '',
    field_type: field?.field_type || 'text',
    is_required: field?.is_required ?? true,
    help_text: field?.help_text || '',
    max_file_size_mb: field?.max_file_size_mb || 10,
    max_length: field?.max_length || 500,
    min_value: field?.min_value || 0,
    max_value: field?.max_value || 1000000,
    allowed_extensions: field?.allowed_extensions?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.field_name.trim()) {
      setError('Field name is required');
      return;
    }

    try {
      setLoading(true);

      const data: any = {
        field_name: formData.field_name,
        field_type: formData.field_type,
        is_required: formData.is_required,
        help_text: formData.help_text,
      };

      // Add type-specific configurations
      if (formData.field_type === 'image' || formData.field_type === 'document') {
        data.max_file_size_mb = formData.max_file_size_mb;
        if (formData.field_type === 'document' && formData.allowed_extensions) {
          data.allowed_extensions = formData.allowed_extensions
            .split(',')
            .map((ext) => ext.trim())
            .filter((ext) => ext);
        }
      } else if (formData.field_type === 'text') {
        data.max_length = formData.max_length;
      } else if (formData.field_type === 'number') {
        data.min_value = formData.min_value;
        data.max_value = formData.max_value;
      }

      if (field) {
        console.log('Updating field:', field.id, 'with data:', data);
        await updateResourceField(field.id, data);
      } else {
        console.log('Creating field with data:', data);
        await createResourceField(productType, productId, data);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Save error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save field';
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors) {
        console.error('Validation errors:', validationErrors);
        setError(`Validation failed: ${JSON.stringify(validationErrors)}`);
      } else {
        setError(errorMessage);
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl max-w-lg w-full mx-4 animate-fade-in-up">
        <div className="px-6 py-4 border-b border-dark-border">
          <h3 className="text-lg font-semibold text-text">
            {field ? 'Edit Resource Field' : 'Add Resource Field'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Field Name */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Field Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.field_name}
                onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* Field Type */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Field Type <span className="text-danger">*</span>
              </label>
              <select
                value={formData.field_type}
                onChange={(e) => setFormData({ ...formData, field_type: e.target.value as any })}
                className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={!!field}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="phone">Phone Number</option>
                <option value="date">Date</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
              </select>
            </div>

            {/* Is Required */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_required"
                checked={formData.is_required}
                onChange={(e) => setFormData({ ...formData, is_required: e.target.checked })}
                className="w-4 h-4 rounded border-dark-border bg-dark-hover text-primary focus:ring-2 focus:ring-primary/50 mr-2"
              />
              <label htmlFor="is_required" className="text-sm text-text">
                Required field
              </label>
            </div>

            {/* Help Text */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Help Text</label>
              <input
                type="text"
                value={formData.help_text}
                onChange={(e) => setFormData({ ...formData, help_text: e.target.value })}
                placeholder="Instructions for users"
                className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Type-specific fields */}
            {(formData.field_type === 'image' || formData.field_type === 'document') && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={formData.max_file_size_mb}
                  onChange={(e) =>
                    setFormData({ ...formData, max_file_size_mb: parseInt(e.target.value) })
                  }
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            {formData.field_type === 'document' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Allowed Extensions (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.allowed_extensions}
                  onChange={(e) => setFormData({ ...formData, allowed_extensions: e.target.value })}
                  placeholder="pdf, docx, doc"
                  className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            {formData.field_type === 'text' && (
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Max Length
                </label>
                <input
                  type="number"
                  value={formData.max_length}
                  onChange={(e) =>
                    setFormData({ ...formData, max_length: parseInt(e.target.value) })
                  }
                  min="1"
                  max="5000"
                  className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            {formData.field_type === 'number' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Min Value
                  </label>
                  <input
                    type="number"
                    value={formData.min_value}
                    onChange={(e) =>
                      setFormData({ ...formData, min_value: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Max Value
                  </label>
                  <input
                    type="number"
                    value={formData.max_value}
                    onChange={(e) =>
                      setFormData({ ...formData, max_value: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </>
            )}
          </div>
        </form>

        <div className="px-6 py-4 border-t border-dark-border flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text bg-dark-hover border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-glow-primary flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{loading ? 'Saving...' : field ? 'Update Field' : 'Add Field'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceFieldBuilder;
