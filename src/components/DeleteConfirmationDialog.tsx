interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
}

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
}: DeleteConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-surface border border-dark-border rounded-xl shadow-xl max-w-md w-full mx-4 animate-fade-in-up">
        <div className="px-6 py-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text">{title}</h3>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-text-muted">{message}</p>
          {itemName && (
            <p className="mt-2 text-text font-semibold">"{itemName}"</p>
          )}
        </div>
        <div className="px-6 py-4 border-t border-dark-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text bg-dark-hover border border-dark-border rounded-lg hover:bg-dark-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors shadow-glow-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
