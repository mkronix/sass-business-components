import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Edit,
  Heart,
  Mail,
  Phone,
  Pin,
  Share,
  Shield,
  User,
  XCircle
} from 'lucide-react';

interface PreviewModalProps<T = any> {
  isOpen: boolean;
  item: T | null;
  getRowId: (row: T) => string | number;
  favorites: Set<string | number>;
  pinnedItems: Set<string | number>;
  onClose: () => void;
  onToggleFavorite: (rowId: string | number) => void;
  onPinItem: (rowId: string | number) => void;
}

const PreviewModal = <T extends Record<string, any>>({
  isOpen,
  item,
  getRowId,
  favorites,
  pinnedItems,
  onClose,
  onToggleFavorite,
  onPinItem
}: PreviewModalProps<T>) => {

  if (!item) return null;

  const rowId = getRowId(item);
  const isFavorite = favorites.has(rowId);
  const isPinned = pinnedItems.has(rowId);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'inactive': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'on leave': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideCloseButton className="max-w-2xl max-h-[90vh] bg-[#0A0A0A] border-white/20 text-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10">
                <User className="h-8 w-8 text-white/70" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {item.name || 'Unnamed Item'}
                </DialogTitle>
                <DialogDescription className="text-white/60 mt-1">
                  {item.role || 'No Role Assigned'} • {item.department || 'Unknown Department'}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 w-8 p-0 border-white/20 hover:bg-white/10",
                  isFavorite && "border-red-400/30 bg-red-400/10 text-red-400"
                )}
                onClick={() => onToggleFavorite(rowId)}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "h-8 w-8 p-0 border-white/20 hover:bg-white/10",
                  isPinned && "border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
                )}
                onClick={() => onPinItem(rowId)}
              >
                <Pin className={cn("h-4 w-4", isPinned && "fill-current")} />
              </Button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 " />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
                  onClick={() => console.log('Edit:', item)}
                >
                  <Edit className="h-4 w-4 " />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 border-white/20 text-white hover:bg-white/10"
                  onClick={() => console.log('Share:', item)}
                >
                  <Share className="h-4 w-4 " />
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Status and Basic Info */}
          <div className="flex items-center gap-3">
            <Badge className={cn("text-sm", getStatusColor(item.status))}>
              {item.status === 'Active' && <CheckCircle className="h-4 w-4 mr-2" />}
              {item.status === 'Inactive' && <XCircle className="h-4 w-4 mr-2" />}
              {item.status === 'On Leave' && <Clock className="h-4 w-4 mr-2" />}
              {item.status}
            </Badge>

            {item.employeeId && (
              <Badge variant="outline" className="bg-white/5 border-white/20 text-white/70">
                ID: {item.employeeId}
              </Badge>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-white/60" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.email && (
                <div className="flex items-center gap-3 p-3 bg-[#171717] rounded-lg border border-white/10">
                  <Mail className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="text-white">{item.email}</p>
                  </div>
                </div>
              )}

              {item.phone && (
                <div className="flex items-center gap-3 p-3 bg-[#171717] rounded-lg border border-white/10">
                  <Phone className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-sm text-white/60">Phone</p>
                    <p className="text-white">{item.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building className="h-5 w-5 text-white/60" />
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-[#171717] rounded-lg border border-white/10">
                <p className="text-sm text-white/60 mb-1">Department</p>
                <p className="text-white">{item.department || 'Not specified'}</p>
              </div>

              <div className="p-3 bg-[#171717] rounded-lg border border-white/10">
                <p className="text-sm text-white/60 mb-1">Position</p>
                <p className="text-white">{item.role || 'Not specified'}</p>
              </div>

              {item.hireDate && (
                <div className="p-3 bg-[#171717] rounded-lg border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Hire Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white/60" />
                    <p className="text-white">{new Date(item.hireDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {item.salary && (
                <div className="p-3 bg-[#171717] rounded-lg border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Salary</p>
                  <p className="text-white">${item.salary.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-white/60" />
                Tags & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;