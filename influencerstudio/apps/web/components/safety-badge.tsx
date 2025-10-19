import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface SafetyBadgeProps {
  status: 'approved' | 'pending' | 'rejected';
  reasons?: string[];
}

export function SafetyBadge({ status, reasons = [] }: SafetyBadgeProps) {
  const isApproved = status === 'approved';
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}
    >
      {isApproved ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
      <span className="capitalize">{status}</span>
      {reasons.length ? <span className="text-muted-foreground">({reasons.join(', ')})</span> : null}
    </div>
  );
}
