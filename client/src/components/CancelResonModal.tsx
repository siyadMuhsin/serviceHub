// components/CancelReasonModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CancelReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  loading?: boolean;
}

export function CancelReasonModal({ isOpen, onClose, onSubmit, loading }: CancelReasonModalProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onSubmit(reason);
    setReason(""); // clear after submit
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
        </DialogHeader>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Reason for cancellation</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
            placeholder="Please provide a reason..."
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button onClick={handleSubmit} disabled={loading || !reason.trim()}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
