
import React from 'react';
import { Play, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicTrackProps {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  duration: string;
  trending: boolean;
  usageCount: number;
}

const MusicTrack: React.FC<MusicTrackProps> = ({
  id,
  title,
  artist,
  coverArt,
  duration,
  trending,
  usageCount,
}) => {
  return (
    <div className="flex items-center p-3 rounded-xl hover:bg-secondary transition-colors duration-200 group">
      <div className="relative w-12 h-12 mr-3">
        <img 
          src={coverArt} 
          alt={title} 
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
          <Play className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{artist}</p>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-xs text-muted-foreground">{duration}</span>
        <div className="flex items-center text-xs mt-1">
          <BarChart className="w-3 h-3 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{usageCount.toLocaleString()}</span>
        </div>
      </div>
      
      {trending && (
        <div className="ml-3 px-2 py-1 bg-instagram-gradient text-white text-xs rounded-full">
          Trending
        </div>
      )}
    </div>
  );
};

export default MusicTrack;
