import Skeleton from '../Skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-card">
      {/* Image */}
      <Skeleton variant="rectangular" height="200px" className="mb-4" />
      
      {/* Title */}
      <Skeleton variant="text" height="24px" className="mb-2" />
      
      {/* Description */}
      <Skeleton variant="text" height="16px" className="mb-1" />
      <Skeleton variant="text" height="16px" width="80%" className="mb-4" />
      
      {/* Price and badges */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="text" height="28px" width="100px" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" height="24px" width="60px" />
          <Skeleton variant="rectangular" height="24px" width="60px" />
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex gap-2">
        <Skeleton variant="rectangular" height="36px" className="flex-1" />
        <Skeleton variant="rectangular" height="36px" className="flex-1" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
