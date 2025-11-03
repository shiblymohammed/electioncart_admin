import { useState } from 'react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
  itemName?: string;
}

const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete',
  itemName = 'this item',
}: DeleteConfirmDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (err) {
      // Error handling is done in the parent component
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl max-w-md w-full animate-fade-in-up">
          {/* Header */}
          <div className="px-6 py-4 border-b border-dark-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-danger/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-text">{title}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-text-muted">
              {message} <span className="font-semibold text-text">{itemName}</span>?
            </p>
            <p className="text-sm text-text-muted mt-2">
              This action cannot be undone.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-dark-border flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 bg-dark-hover hover:bg-dark-border text-text rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmDialog;
