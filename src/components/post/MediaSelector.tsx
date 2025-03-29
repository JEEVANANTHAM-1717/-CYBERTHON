
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaSelectorProps {
  onImageSelect: (imageData: string) => void;
  onVideoSelect: (videoData: string) => void;
}

const MediaSelector = ({ onImageSelect, onVideoSelect }: MediaSelectorProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        onImageSelect(imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const videoData = reader.result as string;
        onVideoSelect(videoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };
  
  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  return (
    <div className="border-2 border-dashed border-muted rounded-lg p-8">
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="py-4">
          <div 
            className="flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors duration-200 p-8"
            onClick={handleImageClick}
          >
            <input 
              type="file" 
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            
            <Image className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-medium mb-2">Drag photos here</h2>
            <Button className="instagram-gradient">
              Select image from computer
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="video" className="py-4">
          <div 
            className="flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors duration-200 p-8"
            onClick={handleVideoClick}
          >
            <input 
              type="file" 
              ref={videoInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleVideoChange}
            />
            
            <Video className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-medium mb-2">Drag videos here</h2>
            <Button className="instagram-gradient">
              Select video from computer
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaSelector;
