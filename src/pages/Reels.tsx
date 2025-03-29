
import React, { useState } from 'react';
import { reels } from '@/lib/mock-data';
import Layout from '@/components/Layout';
import Reel from '@/components/Reel';
import { cn } from '@/lib/utils';

const Reels = () => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  
  return (
    <Layout>
      <div className="h-[calc(100vh-80px)] w-full">
        <div className="relative h-full w-full">
          {reels.map((reel, index) => (
            <div 
              key={reel.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                index === activeReelIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              <Reel 
                id={reel.id}
                userId={reel.userId}
                video={reel.video}
                caption={reel.caption}
                likes={reel.likes}
                comments={reel.comments}
                createdAt={reel.createdAt}
                isActive={index === activeReelIndex}
              />
            </div>
          ))}
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
            <div className="flex flex-col gap-1">
              {reels.map((_, index) => (
                <div 
                  key={index}
                  className={cn(
                    "w-1 h-8 rounded-full cursor-pointer transition-all duration-200", 
                    index === activeReelIndex ? "bg-white" : "bg-white/50"
                  )}
                  onClick={() => setActiveReelIndex(index)}
                />
              ))}
            </div>
          </div>
          
          {activeReelIndex > 0 && (
            <div 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer"
              onClick={() => setActiveReelIndex(prev => Math.max(0, prev - 1))}
            >
              <div className="rounded-full bg-black/30 p-2">
                <span className="text-white text-xl">←</span>
              </div>
            </div>
          )}
        
          {activeReelIndex < reels.length - 1 && (
            <div 
              className="absolute right-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer"
              onClick={() => setActiveReelIndex(prev => Math.min(reels.length - 1, prev + 1))}
            >
              <div className="rounded-full bg-black/30 p-2">
                <span className="text-white text-xl">→</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reels;
