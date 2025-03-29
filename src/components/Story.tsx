
import React from 'react';
import { getUserById } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Verified } from 'lucide-react';

interface StoryProps {
  userId: string;
  viewed?: boolean;
}

const Story: React.FC<StoryProps> = ({ userId, viewed = false }) => {
  const user = getUserById(userId);
  
  if (!user) return null;
  
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className={cn(
        "story-ring cursor-pointer",
        viewed && "opacity-60"
      )}>
        <div className="rounded-full p-[2px] bg-white">
          <img 
            src={user.avatar} 
            alt={user.username} 
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="flex items-center gap-0.5 text-xs">
        <span className="truncate max-w-[64px]">{user.username}</span>
        {user.verified && (
          <Verified className="w-3 h-3 text-instagram-blue" />
        )}
      </div>
    </div>
  );
};

export default Story;
