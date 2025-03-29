import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { users, posts } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

import MediaSelector from '@/components/post/MediaSelector';
import MediaPreview from '@/components/post/MediaPreview';
import PostForm from '@/components/post/PostForm';
import DeepfakeAlert from '@/components/post/DeepfakeAlert';

interface DeepfakeResult {
  is_deepfake: boolean;
  confidence: number;
  media_type?: string;
  visual_result?: {
    is_deepfake: boolean;
    confidence: number;
  };
  audio_result?: {
    is_deepfake: boolean;
    confidence: number;
  };
  dominant_factor?: string;
}

const CreatePost = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [step, setStep] = useState<'select' | 'edit'>('select');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeepfake, setIsDeepfake] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [showDeepfakeWarning, setShowDeepfakeWarning] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [visualResult, setVisualResult] = useState<{ is_deepfake: boolean, confidence: number } | null>(null);
  const [audioResult, setAudioResult] = useState<{ is_deepfake: boolean, confidence: number } | null>(null);
  const [dominantFactor, setDominantFactor] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = users[0]; 
  
  const handleImageSelect = (imageData: string) => {
    setSelectedImage(imageData);
    setSelectedVideo(null);
    setMediaType('image');
    setStep('edit');
    setIsAnalyzing(true);
    resetDetectionState();
  };
  
  const handleVideoSelect = (videoData: string) => {
    setSelectedVideo(videoData);
    setSelectedImage(null);
    setMediaType('video');
    setStep('edit');
    setIsAnalyzing(true);
    resetDetectionState();
  };
  
  const resetDetectionState = () => {
    setIsDeepfake(false);
    setConfidence(0);
    setVisualResult(null);
    setAudioResult(null);
    setDominantFactor(null);
  };
  
  const handleDeepfakeResult = useCallback((result: DeepfakeResult) => {
    const stableConfidence = result.confidence;
    
    setIsDeepfake(result.is_deepfake);
    setConfidence(stableConfidence);
    
    if (result.visual_result) {
      setVisualResult({
        is_deepfake: result.visual_result.is_deepfake,
        confidence: result.visual_result.confidence
      });
    }
    
    if (result.audio_result) {
      setAudioResult({
        is_deepfake: result.audio_result.is_deepfake,
        confidence: result.audio_result.confidence
      });
    }
    
    if (result.dominant_factor) {
      setDominantFactor(result.dominant_factor);
    }
    
    setIsAnalyzing(false);
    
    if (result.is_deepfake) {
      setShowDeepfakeWarning(true);
      
      const detectionSource = result.dominant_factor 
        ? `${result.dominant_factor.charAt(0).toUpperCase() + result.dominant_factor.slice(1)} Analysis` 
        : '';
      
      const displayConfidence = parseFloat((stableConfidence * 100).toFixed(2));
      
      toast({
        title: `Potential Deepfake ${mediaType === 'video' ? 'Video' : 'Image'} Detected`,
        description: `${detectionSource ? `${detectionSource}: ` : ''}Confidence: ${displayConfidence}%`,
        variant: "destructive",
      });
    }
  }, [mediaType, toast]);
  
  const handleRemoveMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setStep('select');
    resetDetectionState();
  };
  
  const handlePost = () => {
    if (!selectedImage && !selectedVideo) return;

    const existingPosts = JSON.parse(localStorage.getItem('instagram-posts') || '[]');
    
    const newPost = {
      id: existingPosts.length > 0 ? Math.max(...existingPosts.map((p: any) => p.id)) + 1 : posts.length + 1,
      userId: currentUser.id,
      images: selectedImage ? [selectedImage] : [],
      videos: selectedVideo ? [selectedVideo] : [],
      caption: caption,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      isDeepfake: isDeepfake,
      deepfakeDetails: mediaType === 'video' ? {
        visual: visualResult,
        audio: audioResult,
        dominant_factor: dominantFactor
      } : null
    };
    
    const updatedPosts = [newPost, ...existingPosts];
    
    localStorage.setItem('instagram-posts', JSON.stringify(updatedPosts));
    
    toast({
      title: "Post created!",
      description: "Your post has been published successfully.",
    });
    
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="mb-6 flex items-center">
          {step === 'edit' && (
            <button 
              className="mr-2"
              onClick={() => setStep('select')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-bold flex-1">Create new post</h1>
          {step === 'edit' && (selectedImage || selectedVideo) && (
            <Button onClick={handlePost}>Share</Button>
          )}
        </div>
        
        {step === 'select' ? (
          <MediaSelector 
            onImageSelect={handleImageSelect}
            onVideoSelect={handleVideoSelect}
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <MediaPreview
              imageData={selectedImage}
              videoData={selectedVideo}
              isAnalyzing={isAnalyzing}
              mediaType={mediaType}
              isDeepfake={isDeepfake}
              confidence={confidence}
              onRemoveMedia={handleRemoveMedia}
              onAnalysisResult={handleDeepfakeResult}
            />
            
            <PostForm
              username={currentUser.username}
              avatar={currentUser.avatar}
              caption={caption}
              isDeepfake={isDeepfake}
              mediaType={mediaType}
              onCaptionChange={setCaption}
            />
          </div>
        )}
      </div>
      
      <DeepfakeAlert
        open={showDeepfakeWarning}
        onOpenChange={setShowDeepfakeWarning}
        mediaType={mediaType}
        confidence={confidence}
      />
    </Layout>
  );
};

export default CreatePost;
