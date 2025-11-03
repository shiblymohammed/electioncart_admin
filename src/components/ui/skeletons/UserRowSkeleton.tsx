import Skeleton from '../Skeleton';

const UserRowSkeleton = () => {
  return (
    <tr className="border-b border-dark-border">
      <td className="px-4 py-4">
        <Skeleton variant="text" height="16px" width="120px" />
      </td>
      <td className="px-4 py-4">
        <Skeleton variant="text" height="16px" width="140px" />
      </td>
      <td className="px-4 py-4">
        <Skeleton variant="rectangular" height="24px" width="80px" />
      </td>
      <td className="px-4 py-4">
        <Skeleton variant="text" height="16px" width="100px" />
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2">
          <Skeleton variant="text" height="16px" width="40px" />
          <Skeleton variant="text" height="16px" width="50px" />
        </div>
      </td>
    </tr>
  );
};

export default UserRowSkeleton;
