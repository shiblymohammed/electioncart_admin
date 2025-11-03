import { StaffMember } from '../../../types/order';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

interface StaffCardProps {
  staff: StaffMember;
  showPerformance?: boolean;
}

const StaffCard = ({ staff, showPerformance = true }: StaffCardProps) => {
  return (
    <Card hoverable glowOnHover>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {staff.name?.charAt(0).toUpperCase() || staff.phone?.charAt(0) || 'S'}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text mb-1">{staff.name || staff.phone}</h3>
          <Badge variant="info" size="sm">Staff</Badge>
          
          {showPerformance && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-1">Active Orders</p>
                <p className="text-2xl font-bold text-text">{(staff as any).active_orders || 0}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Completed</p>
                <p className="text-2xl font-bold text-success">{(staff as any).completed_orders || 0}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StaffCard;
