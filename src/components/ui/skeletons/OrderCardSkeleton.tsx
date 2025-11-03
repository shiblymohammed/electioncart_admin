import Skeleton from '../Skeleton';

const OrderCardSkeleton = () => {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton variant="text" height="20px" width="150px" className="mb-2" />
          <Skeleton variant="text" height="14px" width="120px" />
        </div>
        <Skeleton variant="rectangular" height="24px" width="80px" />
      </div>
      
      {/* Customer info */}
      <div className="mb-4">
        <Skeleton variant="text" height="14px" width="100px" className="mb-2" />
        <Skeleton variant="text" height="14px" width="140px" />
      </div>
      
      {/* Amount */}
      <div className="mb-4">
        <Skeleton variant="text" height="24px" width="120px" />
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Skeleton variant="rectangular" height="36px" className="flex-1" />
        <Skeleton variant="rectangular" height="36px" width="100px" />
      </div>
    </div>
  );
};

export default OrderCardSkeleton;
