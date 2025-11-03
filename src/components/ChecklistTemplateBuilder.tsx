import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChecklistTemplateItem } from '../types/product';
import { useToast } from '../hooks/useToast';
import {
  getChecklistTemplate,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  reorderChecklistItems,
} from '../services/productService';

interface ChecklistTemplateBuilderProps {
  productType: 'package' | 'campaign';
  productId: number;
}

// Sortable Checklist Item Component
interface SortableChecklistItemProps {
  item: ChecklistTemplateItem;
  onEdit: (item: ChecklistTemplateItem) => void;
  onDelete: (itemId: number) => void;
}

function SortableChecklistItem({ item, onEdit, onDelete }: SortableChecklistItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id.toString(),
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              disabled
              className="w-4 h-4 rounded border-dark-border bg-dark-surface"
            />
            <div className="flex-1">
              <h4 className="font-medium text-text">{item.name}</h4>
              {item.description && (
                <p className="text-sm text-text-muted mt-1">{item.description}</p>
              )}
              {item.is_optional && (
                <span className="text-xs text-warning mt-1 inline-block">(Optional)</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-primary hover:text-primary/80 text-sm transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-danger hover:text-danger/80 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const ChecklistTemplateBuilder = ({ productType, productId }: ChecklistTemplateBuilderProps) => {
  const { showSuccess, showError: showErrorToast } = useToast();
  const [items, setItems] = useState<ChecklistTemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistTemplateItem | null>(null);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchItems();
  }, [productType, productId]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getChecklistTemplate(productType, productId);
      setItems(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load checklist template');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item.id.toString() === active.id);
    const newIndex = items.findIndex(item => item.id.toString() === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const newItems = [...items];
    const [movedItem] = newItems.splice(oldIndex, 1);
    newItems.splice(newIndex, 0, movedItem);
    setItems(newItems);

    try {
      setReordering(true);
      const itemIds = newItems.map(item => item.id);
      await reorderChecklistItems(itemIds);
      showSuccess('Checklist items reordered successfully');
    } catch (err: any) {
      console.error('Reorder error:', err);
      // Check if it's a 400 or 404 error (endpoint not implemented)
      if (err.response?.status === 400 || err.response?.status === 404) {
        showErrorToast('Reorder feature not yet implemented in backend. Order saved locally only.');
        // Keep the new order in UI even though backend doesn't support it yet
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to reorder items';
        showErrorToast(errorMsg);
        // Revert on other failures
        await fetchItems();
      }
    } finally {
      setReordering(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!confirm('Are you sure you want to delete this checklist item?')) return;

    try {
      await deleteChecklistItem(itemId);
      await fetchItems();
      showSuccess('Checklist item deleted successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete item';
      setError(errorMsg);
      showErrorToast(errorMsg);
    }
  };

  const handleEdit = (item: ChecklistTemplateItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormSuccess = () => {
    fetchItems();
    handleFormClose();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-text-muted">Loading checklist...</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text">Checklist Template</h3>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 text-sm shadow-glow-primary"
        >
          + Add Item
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-danger/20 border border-danger rounded-lg text-danger px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-text-muted text-center py-8">
          No checklist items configured. Add items to define the workflow for this product.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(i => i.id.toString())} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((item) => (
                <SortableChecklistItem
                  key={item.id}
                  item={item}
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
            <span className="text-sm">Reordering items...</span>
          </div>
        </div>
      )}

      {showForm && (
        <ChecklistItemForm
          productType={productType}
          productId={productId}
          item={editingItem}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

interface ChecklistItemFormProps {
  productType: 'package' | 'campaign';
  productId: number;
  item: ChecklistTemplateItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ChecklistItemForm = ({
  productType,
  productId,
  item,
  onClose,
  onSuccess,
}: ChecklistItemFormProps) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    is_optional: item?.is_optional ?? false,
    estimated_duration_minutes: item?.estimated_duration_minutes || null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Item name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setLoading(true);

      const data: any = {
        name: formData.name,
        description: formData.description,
        is_optional: formData.is_optional,
      };

      if (formData.estimated_duration_minutes) {
        data.estimated_duration_minutes = formData.estimated_duration_minutes;
      }

      if (item) {
        await updateChecklistItem(item.id, data);
      } else {
        await createChecklistItem(productType, productId, data);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save checklist item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl max-w-lg w-full mx-4 animate-fade-in-up">
        <div className="px-6 py-4 border-b border-dark-border">
          <h3 className="text-lg font-semibold text-text">
            {item ? 'Edit Checklist Item' : 'Add Checklist Item'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 custom-scrollbar">
          {error && (
            <div className="mb-4 bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Item Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Review campaign materials"
                className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed instructions for this task"
                rows={3}
                className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* Is Optional */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_optional"
                checked={formData.is_optional}
                onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
                className="w-4 h-4 rounded border-dark-border bg-dark-hover text-primary focus:ring-2 focus:ring-primary/50 mr-2"
              />
              <label htmlFor="is_optional" className="text-sm text-text">
                Optional item (does not affect completion percentage)
              </label>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.estimated_duration_minutes || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_duration_minutes: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                min="1"
                placeholder="Optional"
                className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
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
            <span>{loading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistTemplateBuilder;
