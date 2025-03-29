
import React from 'react';
import { posts, stories, users } from '@/lib/mock-data';
import Layout from '@/components/Layout';
import Story from '@/components/Story';
import Post from '@/components/Post';

const Index = () => {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-4 px-4">
        <div className="mb-6">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {users.map((user) => (
              <Story key={user.id} userId={user.id} />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          {sortedPosts.map((post) => (
            <Post 
              key={post.id} 
              id={post.id}
              userId={post.userId}
              images={post.images}
              caption={post.caption}
              likes={post.likes}
              comments={post.comments}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
