import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'http://127.0.0.1:8080/detect-deepfake';

interface DeepfakeDetectionResult {
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

interface DeepfakeDetectionProps {
  imageData: string | null;
  videoData: string | null;
  onResult: (result: DeepfakeDetectionResult) => void;
}

export const useDeepfakeDetection = (
  imageData: string | null, 
  videoData: string | null, 
  callback: (result: DeepfakeDetectionResult) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const stabilizeResult = useCallback((result: DeepfakeDetectionResult): DeepfakeDetectionResult => {
    const stableResult = {
      ...result,
      confidence: parseFloat(result.confidence.toFixed(4))
    };
    
    if (stableResult.visual_result) {
      stableResult.visual_result.confidence = parseFloat(stableResult.visual_result.confidence.toFixed(4));
    }
    
    if (stableResult.audio_result) {
      stableResult.audio_result.confidence = parseFloat(stableResult.audio_result.confidence.toFixed(4));
    }
    
    return stableResult;
  }, []);

  useEffect(() => {
    const detectDeepfake = async () => {
      if (!imageData && !videoData) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        let requestData;
        
        if (imageData) {
          const base64Data = imageData.split(',')[1];
          requestData = { image: base64Data };
        } else if (videoData) {
          const base64Data = videoData.split(',')[1];
          requestData = { video: base64Data };
          
          toast({
            title: "Processing Video",
            description: "Video analysis (visual & audio) may take longer than images. Please wait...",
            duration: 3000,
          });
        }
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        const stableResult = stabilizeResult(result);
        callback(stableResult);
      } catch (err) {
        console.error('Deepfake detection error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        callback({
          is_deepfake: false,
          confidence: 0,
          media_type: imageData ? 'image' : 'video'
        });
        
        toast({
          title: "Detection Service Unavailable",
          description: "Using fallback detection method.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (imageData || videoData) {
      detectDeepfake();
    }
  }, [imageData, videoData, callback, toast, stabilizeResult]);
  
  return { isLoading, error };
};

export const DeepfakeDetection: React.FC<DeepfakeDetectionProps> = ({ 
  imageData, 
  videoData, 
  onResult 
}) => {
  const { isLoading, error } = useDeepfakeDetection(imageData, videoData, onResult);
  
  if (!imageData && !videoData) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {isLoading && (
        <div className="bg-black/70 absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
            <p>{videoData ? "Analyzing video..." : "Analyzing image..."}</p>
            {videoData && (
              <p className="text-sm mt-1">Analyzing visual content and audio</p>
            )}
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-2 right-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm">
          API Error: Using fallback detection
        </div>
      )}
    </div>
  );
};
