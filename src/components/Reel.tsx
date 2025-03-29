
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserById, likeReel } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Verified, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface ReelProps {
  id: string;
  userId: string;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  isActive: boolean;
}

const Reel: React.FC<ReelProps> = ({
  id,
  userId,
  video,
  caption,
  likes: initialLikes,
  comments,
  createdAt,
  isActive,
}) => {
  const user = getUserById(userId);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !error) {
        videoRef.current.play()
          .then(() => setPlaying(true))
          .catch(error => {
            console.error('Error playing video:', error);
            setError(true);
          });
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  }, [isActive, error]);
  
  if (!user) return null;
  
  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    likeReel(id, newLikedState);
    setLikesCount(prevLikes => newLikedState ? prevLikes + 1 : prevLikes - 1);
    
    if (newLikedState) {
      toast({
        title: "Liked",
        description: "You liked this reel",
      });
    }
  };
  
  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Removed from saved" : "Saved",
      description: saved ? "Reel removed from your saved items" : "Reel saved to your collection",
    });
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
      
      toast({
        title: muted ? "Sound On" : "Sound Off",
        description: muted ? "Video sound has been enabled" : "Video sound has been muted",
        duration: 1500,
      });
    }
  };
  
  const togglePlay = () => {
    if (videoRef.current && !error) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setPlaying(true))
          .catch(error => {
            console.error('Error playing video:', error);
            setError(true);
          });
      }
    }
  };
  
  return (
    <div className="relative h-full w-full bg-black">
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        {!error ? (
          <video 
            ref={videoRef}
            src={video}
            className="h-full w-full object-contain"
            loop
            muted={muted}
            playsInline
            onClick={togglePlay}
            onError={() => setError(true)}
          />
        ) : (
          <div className="text-white text-center p-4">
            <p>Sorry, this video couldn't be played.</p>
            <p className="text-sm mt-2">The video format may not be supported by your browser.</p>
          </div>
        )}
      </div>
      
      {!playing && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20" onClick={togglePlay}>
          <div className="rounded-full bg-black/50 p-3">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      )}
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="flex flex-col justify-between h-full">
          <div className="p-4 pointer-events-auto">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-sm text-white">{user.username}</span>
                  {user.verified && <Verified className="w-3 h-3 text-white" />}
                </div>
              </Link>
              <span className="text-xs text-white/80">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {!error && (
            <div className="absolute top-20 right-4 pointer-events-auto">
              <div 
                className="flex items-center space-x-2 bg-black/50 rounded-full p-2"
                onClick={toggleMute}
              >
                {muted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
                <div className="mr-1 pointer-events-auto">
                  <Switch 
                    checked={!muted} 
                    onCheckedChange={() => toggleMute()}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="p-4">
            <div className="flex">
              <div className="flex-1 pr-12">
                <p className="text-sm text-white mb-2">{caption}</p>
              </div>
              
              <div className="flex flex-col gap-4 pointer-events-auto">
                <button className="flex flex-col items-center gap-1" onClick={handleLike}>
                  <div className="bg-black/30 rounded-full p-2">
                    <Heart className={cn("w-6 h-6 transition-all duration-200", liked ? "fill-red-500 text-red-500 animate-wiggle" : "text-white")} />
                  </div>
                  <span className="text-xs text-white">{likesCount}</span>
                </button>
                
                <button className="flex flex-col items-center gap-1">
                  <div className="bg-black/30 rounded-full p-2">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white">{comments}</span>
                </button>
                
                <button className="flex flex-col items-center gap-1">
                  <div className="bg-black/30 rounded-full p-2">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                </button>
                
                <button className="flex flex-col items-center gap-1" onClick={handleSave}>
                  <div className="bg-black/30 rounded-full p-2">
                    <Bookmark className={cn("w-6 h-6 transition-all duration-200", saved ? "fill-white text-white" : "text-white")} />
                  </div>
                </button>
                
                {!error && (
                  <button className="flex flex-col items-center gap-1" onClick={toggleMute}>
                    <div className="bg-black/30 rounded-full p-2">
                      {muted ? (
                        <VolumeX className="w-6 h-6 text-white" />
                      ) : (
                        <Volume2 className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reel;
