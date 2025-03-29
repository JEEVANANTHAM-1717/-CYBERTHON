
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

interface PostFormProps {
  username: string;
  avatar: string;
  caption: string;
  isDeepfake: boolean;
  mediaType: 'image' | 'video';
  onCaptionChange: (caption: string) => void;
}

const PostForm = ({
  username,
  avatar,
  caption,
  isDeepfake,
  mediaType,
  onCaptionChange
}: PostFormProps) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 p-3 border-b">
        <img 
          src={avatar} 
          alt={username} 
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{username}</span>
      </div>
      
      {isDeepfake && (
        <Alert variant="destructive" className="mb-3 mt-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This {mediaType} has been detected as a potential deepfake. 
            Please review carefully before posting.
          </AlertDescription>
        </Alert>
      )}
      
      <Textarea 
        placeholder="Write a caption..." 
        className="border-none resize-none h-32 p-3"
        value={caption}
        onChange={(e) => onCaptionChange(e.target.value)}
      />
    </div>
  );
};

export default PostForm;
