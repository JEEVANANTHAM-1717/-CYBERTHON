
import React, { useState } from 'react';
import { musicTracks } from '@/lib/mock-data';
import Layout from '@/components/Layout';
import MusicTrack from '@/components/MusicTrack';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Music = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTracks = musicTracks.filter(track => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    track.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingTracks = musicTracks.filter(track => track.trending);
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-4 px-4">
        <h1 className="text-2xl font-bold mb-6">Music</h1>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              className="pl-10"
              placeholder="Search songs" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {searchTerm ? (
          <div className="space-y-1">
            <h2 className="text-lg font-medium mb-3">Search Results</h2>
            {filteredTracks.length > 0 ? (
              filteredTracks.map(track => (
                <MusicTrack 
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  coverArt={track.coverArt}
                  duration={track.duration}
                  trending={track.trending}
                  usageCount={track.usageCount}
                />
              ))
            ) : (
              <p className="text-muted-foreground py-4">No tracks found.</p>
            )}
          </div>
        ) : (
          <Tabs defaultValue="trending">
            <TabsList className="mb-4">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="all">All Songs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="space-y-1">
              {trendingTracks.map(track => (
                <MusicTrack 
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  coverArt={track.coverArt}
                  duration={track.duration}
                  trending={track.trending}
                  usageCount={track.usageCount}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-1">
              {musicTracks.map(track => (
                <MusicTrack 
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  coverArt={track.coverArt}
                  duration={track.duration}
                  trending={track.trending}
                  usageCount={track.usageCount}
                />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Music;
