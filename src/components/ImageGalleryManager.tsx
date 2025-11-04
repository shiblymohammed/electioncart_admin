import { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ProductImage } from '../types/product';
import { useToast } from '../hooks/useToast';
import DeleteConfirmDialog from './ui/DeleteConfirmDialog';
import OptimizedImage from './ui/OptimizedImage';
import {
  getProductImages,
  uploadProductImage,
  deleteProductImage,
  reorderProductImages,
  setPrimaryImage,
  updateProductImage,
} from '../services/productService';

interface ImageGalleryManagerProps {
  productType: 'package' | 'campaign';
  productId: number;
}

// Sortable Image Card Component
interface SortableImageCardProps {
  image: ProductImage;
  editingImage: ProductImage | null;
  onSetPrimary: (imageId: number) => void;
  onEditAltText: (image: ProductImage) => void;
  onSaveAltText: (imageId: number, altText: string) => void;
  onDelete: (imageId: number) => void;
  onCancelEdit: () => void;
}

function SortableImageCard({
  image,
  editingImage,
  onSetPrimary,
  onEditAltText,
  onSaveAltText,
  onDelete,
  onCancelEdit,
}: SortableImageCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id.toString(),
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
      className={`relative border-2 rounded-lg overflow-hidden transition-all ${
        image.is_primary ? 'border-primary shadow-glow-primary' : 'border-dark-border'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 bg-dark-surface/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-text cursor-grab active:cursor-grabbing hover:bg-dark-hover z-10"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </div>

      {/* Primary Badge */}
      {image.is_primary && (
        <div className="absolute top-2 right-2 bg-primary text-primary-content text-xs px-2 py-1 rounded shadow-glow-primary flex items-center gap-1 z-10">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Primary
        </div>
      )}

      {/* Image Preview - Requirement 8.4: Optimize images with lazy loading */}
      <OptimizedImage
        src={image.thumbnail || image.image}
        alt={image.alt_text || 'Product image'}
        className="w-full h-48 object-cover"
      />

      {/* Image Actions */}
      <div className="p-2 bg-dark-hover">
        {editingImage?.id === image.id ? (
          <div className="space-y-2">
            <input
              type="text"
              defaultValue={image.alt_text}
              placeholder="Alt text"
              className="w-full px-2 py-1 text-xs bg-dark border border-dark-border rounded text-text placeholder-text-muted focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSaveAltText(image.id, e.currentTarget.value);
                } else if (e.key === 'Escape') {
                  onCancelEdit();
                }
              }}
              autoFocus
            />
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  const input = document.querySelector(`input[defaultValue="${image.alt_text}"]`) as HTMLInputElement;
                  onSaveAltText(image.id, input?.value || '');
                }}
                className="flex-1 text-xs px-2 py-1 bg-primary text-primary-content rounded hover:bg-primary/90"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="flex-1 text-xs px-2 py-1 bg-dark-border text-text rounded hover:bg-dark-hover"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-text-muted truncate mb-2">
              {image.alt_text || 'No alt text'}
            </p>
            <div className="flex flex-wrap gap-1">
              {!image.is_primary && (
                <button
                  onClick={() => onSetPrimary(image.id)}
                  className="text-xs px-2 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors"
                >
                  Set Primary
                </button>
              )}
              <button
                onClick={() => onEditAltText(image)}
                className="text-xs px-2 py-1 bg-dark-border text-text rounded hover:bg-dark-hover transition-colors"
              >
                Edit Alt
              </button>
              <button
                onClick={() => onDelete(image.id)}
                className="text-xs px-2 py-1 bg-danger/20 text-danger rounded hover:bg-danger/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const ImageGalleryManager = ({ productType, productId }: ImageGalleryManagerProps) => {
  const { showSuccess, showError: showErrorToast } = useToast();
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ProductImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchImages();
  }, [productType, productId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await getProductImages(productType, productId);
      setImages(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      await uploadProductImage(productType, productId, formData);
      await fetchImages();
      showSuccess('Image uploaded successfully');

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to upload image';
      setError(errorMsg);
      showErrorToast(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (imageId: number) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      setImageToDelete(image);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      await deleteProductImage(imageToDelete.id);
      await fetchImages();
      showSuccess('Image deleted successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete image';
      setError(errorMsg);
      showErrorToast(errorMsg);
      throw err; // Re-throw to keep dialog open on error
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      await setPrimaryImage(imageId);
      await fetchImages();
      showSuccess('Primary image updated successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to set primary image';
      setError(errorMsg);
      showErrorToast(errorMsg);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex(img => img.id.toString() === active.id);
    const newIndex = images.findIndex(img => img.id.toString() === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistically update UI
    const newImages = [...images];
    const [movedImage] = newImages.splice(oldIndex, 1);
    newImages.splice(newIndex, 0, movedImage);
    setImages(newImages);

    try {
      const imageIds = newImages.map((img) => img.id);
      await reorderProductImages(imageIds);
      showSuccess('Images reordered successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to reorder images';
      setError(errorMsg);
      showErrorToast(errorMsg);
      fetchImages(); // Reload to reset order
    }
  };

  const handleEditAltText = (image: ProductImage) => {
    setEditingImage(image);
  };

  const handleSaveAltText = async (imageId: number, altText: string) => {
    try {
      await updateProductImage(imageId, { alt_text: altText });
      await fetchImages();
      setEditingImage(null);
      showSuccess('Alt text updated successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update alt text';
      setError(errorMsg);
      showErrorToast(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-text-muted">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text">Product Images</h3>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 text-sm cursor-pointer inline-block shadow-glow-primary ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'Uploading...' : '+ Upload Image'}
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-danger/20 border border-danger rounded-lg text-danger px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <p className="text-sm text-text-muted mb-4">
        Maximum 10 images. Supported formats: JPG, PNG, GIF. Max size: 5MB per image.
      </p>

      {images.length === 0 ? (
        <p className="text-text-muted text-center py-8">
          No images uploaded. Add images to showcase this product.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images.map(img => img.id.toString())} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <SortableImageCard
                  key={image.id}
                  image={image}
                  editingImage={editingImage}
                  onSetPrimary={handleSetPrimary}
                  onEditAltText={handleEditAltText}
                  onSaveAltText={handleSaveAltText}
                  onDelete={handleDeleteClick}
                  onCancelEdit={() => setEditingImage(null)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setImageToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Image"
        message="Are you sure you want to delete"
        itemName={imageToDelete?.alt_text || 'this image'}
      />

      {images.length >= 10 && (
        <p className="text-sm text-warning mt-4">
          Maximum number of images (10) reached. Delete an image to upload more.
        </p>
      )}
    </div>
  );
};

export default ImageGalleryManager;
