
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeepfakeAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: 'image' | 'video';
  confidence: number;
}

const DeepfakeAlert = ({ open, onOpenChange, mediaType, confidence }: DeepfakeAlertProps) => {

  const displayConfidence = Math.round(confidence * 10000) / 100;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Potential Deepfake {mediaType === 'video' ? 'Video' : 'Image'} Detected
          </AlertDialogTitle>
          <AlertDialogDescription>
            Our AI has detected this {mediaType} as potentially manipulated:
            <div className="mt-2 text-center">
              <p className="font-bold text-lg">Confidence: {displayConfidence}%</p>
            </div>
            Posting deliberately misleading content may violate our community guidelines.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Choose Another {mediaType === 'video' ? 'Video' : 'Image'}</AlertDialogCancel>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Continue Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeepfakeAlert;
