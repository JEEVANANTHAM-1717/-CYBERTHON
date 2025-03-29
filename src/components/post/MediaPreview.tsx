import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { DeepfakeDetection } from '@/pages/CreatePostApi';

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

interface MediaPreviewProps {
  imageData: string | null;
  videoData: string | null;
  isAnalyzing: boolean;
  mediaType: 'image' | 'video';
  isDeepfake: boolean;
  confidence: number;
  onRemoveMedia: () => void;
  onAnalysisResult: (result: DeepfakeResult) => void;
}

const MediaPreview = ({
  imageData,
  videoData,
  isAnalyzing,
  mediaType,
  isDeepfake,
  confidence,
  onRemoveMedia,
  onAnalysisResult
}: MediaPreviewProps) => {
  const displayConfidence = Math.round(confidence * 10000) / 100;
  
  return (
    <div className="relative flex-1 aspect-square bg-black rounded-lg overflow-hidden">
      {imageData && (
        <>
          <img 
            src={imageData} 
            alt="Selected" 
            className="w-full h-full object-contain"
          />
          <button 
            className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
            onClick={onRemoveMedia}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {!isAnalyzing && (
            <div 
              className={`absolute top-2 left-2 px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                isDeepfake 
                  ? 'bg-red-500/90 text-white' 
                  : 'bg-green-500/90 text-white'
              }`}
            >
              {isDeepfake ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              {isDeepfake ? 'Potential Deepfake' : 'Real Image'}
              {confidence > 0 && (
                <span className="ml-2 opacity-75">
                  ({displayConfidence}%)
                </span>
              )}
            </div>
          )}
          
          <DeepfakeDetection 
            imageData={imageData}
            videoData={null}
            onResult={onAnalysisResult} 
          />
        </>
      )}
      
      {videoData && (
        <>
          <video 
            src={videoData} 
            controls
            className="w-full h-full object-contain"
          />
          <button 
            className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
            onClick={onRemoveMedia}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {!isAnalyzing && (
            <div 
              className={`absolute top-2 left-2 px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                isDeepfake 
                  ? 'bg-red-500/90 text-white' 
                  : 'bg-green-500/90 text-white'
              }`}
            >
              {isDeepfake ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              {isDeepfake ? 'Potential Fake Video' : 'Real Video'}
              {confidence > 0 && (
                <span className="ml-2 opacity-75">
                  ({displayConfidence}%)
                </span>
              )}
            </div>
          )}
          
          <DeepfakeDetection 
            imageData={null}
            videoData={videoData}
            onResult={onAnalysisResult} 
          />
        </>
      )}
      
      {isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
            <p>Analyzing {mediaType === 'image' ? 'image' : 'video'}...</p>
            {mediaType === 'video' && (
              <p className="text-sm mt-1">This may take a moment</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPreview;
