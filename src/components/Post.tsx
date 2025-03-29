
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserById, getCommentsByPostId, likePost, addComment } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Verified } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface PostProps {
  id: number;
  userId: string;
  images: string[];
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
}

const Post: React.FC<PostProps> = ({
  id,
  userId,
  images,
  caption,
  likes: initialLikes,
  comments: commentCount,
  createdAt,
}) => {
  const user = getUserById(userId);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsData, setCommentsData] = useState(getCommentsByPostId(id));
  const { toast } = useToast();
  
  if (!user) return null;
  
  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    likePost(id, newLikedState);
    setLikesCount(prevLikes => newLikedState ? prevLikes + 1 : prevLikes - 1);
  };
  
  const handleSave = () => {
    setSaved(!saved);
  };
  
  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    
    const newComment = {
      id: `temp-${Date.now()}`,
      postId: id,
      userId: '1', 
      content: commentInput,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    
    addComment(newComment);
    setCommentsData([...commentsData, newComment]);
    setCommentInput('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
  };
  
  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  return (
    <>
      <div className="post-card max-w-lg w-full">
        {/* Post header */}
        <div className="flex items-center justify-between p-3">
          <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">{user.username}</span>
                {user.verified && <Verified className="w-3 h-3 text-instagram-blue" />}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
            </div>
          </Link>
          <button className="btn-icon">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      
        <div className="relative">
          <img 
            src={images[currentImageIndex]} 
            alt={`Post ${id}`} 
            className="w-full aspect-square object-cover animate-fade-in"
          />
          
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200", 
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  )}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
          
          {images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
                  onClick={prevImage}
                >
                  &larr;
                </button>
              )}
              {currentImageIndex < images.length - 1 && (
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
                  onClick={nextImage}
                >
                  &rarr;
                </button>
              )}
            </>
          )}
        </div>
        
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button className="btn-icon" onClick={handleLike}>
                <Heart className={cn("w-6 h-6 transition-all duration-200", liked ? "fill-red-500 text-red-500 animate-wiggle" : "")} />
              </button>
              <button className="btn-icon" onClick={() => setShowComments(true)}>
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="btn-icon">
                <Send className="w-6 h-6" />
              </button>
            </div>
            <button className="btn-icon" onClick={handleSave}>
              <Bookmark className={cn("w-6 h-6 transition-all duration-200", saved ? "fill-foreground" : "")} />
            </button>
          </div>
        
          <div className="font-medium text-sm mb-1">
            {likesCount} likes
          </div>
          
          <div className="text-sm mb-1">
            <Link to={`/profile/${user.username}`} className="font-medium mr-1">
              {user.username}
            </Link>
            <span>{caption}</span>
          </div>
          
          {commentsData.length > 0 && (
            <button 
              className="text-muted-foreground text-sm"
              onClick={() => setShowComments(true)}
            >
              View all {commentsData.length} comments
            </button>
          )}
        </div>
      </div>
    
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto px-1">
            {commentsData.map((comment) => {
              const commentUser = getUserById(comment.userId);
              if (!commentUser) return null;
              
              return (
                <div key={comment.id} className="flex items-start gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={commentUser.avatar} alt={commentUser.username} />
                    <AvatarFallback>{commentUser.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <Link to={`/profile/${commentUser.username}`} className="font-medium text-sm">
                        {commentUser.username}
                      </Link>
                      {commentUser.verified && <Verified className="w-3 h-3 text-instagram-blue" />}
                      <span className="text-xs text-muted-foreground ml-1">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                  <button className="text-muted-foreground">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-2 border-t pt-3">
            <textarea 
              className="flex-1 bg-muted/50 p-2 rounded-lg text-sm resize-none"
              placeholder="Add a comment..."
              rows={1}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <Button onClick={handleAddComment}>Post</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Post;
