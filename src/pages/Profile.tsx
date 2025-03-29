
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { users, getPostsByUserId, followUser } from '@/lib/mock-data';
import Layout from '@/components/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Verified, Grid, Bookmark, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { username = users[0].username } = useParams<{ username: string }>();
  const [following, setFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(users.find(u => u.username === username));
  const { toast } = useToast();
  
  useEffect(() => {
    setCurrentUser(users.find(u => u.username === username));
  }, [username]);
  
  if (!currentUser) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }
  
  const userPosts = getPostsByUserId(currentUser.id);
  
  const handleFollow = () => {
    const newFollowingState = !following;
    setFollowing(newFollowingState);
  
    followUser(currentUser.id, newFollowingState);
  
    setCurrentUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        followers: newFollowingState ? prev.followers + 1 : prev.followers - 1
      };
    });
    
    toast({
      title: newFollowingState ? "Following" : "Unfollowed",
      description: newFollowingState 
        ? `You are now following ${currentUser.username}` 
        : `You unfollowed ${currentUser.username}`,
    });
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <Avatar className="w-24 h-24 md:w-32 md:h-32">
            <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
            <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-medium">{currentUser.username}</h1>
                {currentUser.verified && <Verified className="w-5 h-5 text-instagram-blue" />}
              </div>
              
              <div className="flex gap-2">
                {currentUser.username === 'johndoe' ? (
                  <>
                    <Button variant="outline" className="h-9">Edit Profile</Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    className={cn("h-9", !following && "instagram-gradient")}
                    variant={following ? "outline" : "default"}
                    onClick={handleFollow}
                  >
                    {following ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex gap-6 mb-4">
              <div>
                <span className="font-medium">{userPosts.length}</span> posts
              </div>
              <div>
                <span className="font-medium">{currentUser.followers.toLocaleString()}</span> followers
              </div>
              <div>
                <span className="font-medium">{currentUser.following.toLocaleString()}</span> following
              </div>
            </div>
            
            <div>
              <h2 className="font-medium">{currentUser.fullName}</h2>
              <p className="text-sm whitespace-pre-line">{currentUser.bio}</p>
            </div>
          </div>
        </div>
        

        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-6">
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map(post => (
                <div key={post.id} className="aspect-square overflow-hidden relative group">
                  <img 
                    src={post.images[0]} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="text-white text-sm">
                      <span>❤️ {post.likes}</span>
                      <span className="ml-3">💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Only you can see what you've saved</h3>
              <p className="text-muted-foreground">When you save something, it'll appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
