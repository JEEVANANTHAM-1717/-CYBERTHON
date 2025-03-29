
import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { posts, users } from '@/lib/mock-data';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    searchTerm.trim() !== '' && 
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const explorePosts = [...posts].sort(() => Math.random() - 0.5);
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4 px-4">
        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              className="pl-10"
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {searchTerm.trim() !== '' ? (
          <div className="mt-4">
            <h3 className="font-medium mb-4">Users</h3>
            <div className="space-y-3">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <Link 
                    key={user.id}
                    to={`/profile/${user.username}`}
                    className="flex items-center p-2 rounded-lg hover:bg-secondary transition-colors duration-200"
                  >
                    <Avatar className="mr-3">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.fullName}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground">No users found.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="font-medium mb-4">Explore</h3>
            <div className="grid grid-cols-3 gap-1">
              {explorePosts.map(post => (
                <Link 
                  key={post.id} 
                  to={`/post/${post.id}`}
                  className="aspect-square overflow-hidden relative group"
                >
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
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
