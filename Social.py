
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import os
import sys
import numpy as np
import tensorflow as tf
from PIL import Image
import cv2
import tempfile
import traceback

app = Flask(__name__)
CORS(app)  
MODEL_PATH = "J:/Downloads/snap-bloom-main (4)/snap-bloom-main/deepfake_detector (1).h5"
if not os.path.exists(MODEL_PATH):
    print(f"Error: Model file not found at {MODEL_PATH}")
    print("Please place your deepfake_detector.h5 file in the same directory as this script")
    model = None
else:
    try:
        print("Loading model from:", MODEL_PATH)
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
try:
    import torch
    import torch.nn as nn
    import librosa
    from moviepy.editor import VideoFileClip
    
    class DeepFakeAudioDetector(nn.Module):
        def __init__(self, input_dim=768, hidden_dim=256, num_layers=2):
            super(DeepFakeAudioDetector, self).__init__()
            self.gru = nn.GRU(input_dim, hidden_dim, num_layers, batch_first=True)
            self.fc = nn.Linear(hidden_dim, 1)
            self.sigmoid = nn.Sigmoid()

        def forward(self, x):
            _, h = self.gru(x)
            output = self.fc(h[-1])
            return self.sigmoid(output)

    AUDIO_MODEL_PATH = "deepfake_audio_model.pth"
    if os.path.exists(AUDIO_MODEL_PATH):
        try:
            print("Loading audio model from:", AUDIO_MODEL_PATH)
            audio_classifier = DeepFakeAudioDetector()
            audio_classifier.load_state_dict(torch.load(AUDIO_MODEL_PATH, map_location=torch.device('cpu')))
            audio_classifier.eval()
            audio_model_available = True
            print("Audio model loaded successfully")
        except Exception as e:
            print(f"Error loading audio model: {e}")
            audio_model_available = False
    else:
        print(f"Audio model file not found at {AUDIO_MODEL_PATH}")
        print("Will use random detection for audio")
        audio_model_available = False
    try:
        from transformers import AutoProcessor, AutoModel
        wav2vec_processor = AutoProcessor.from_pretrained("facebook/wav2vec2-base")
        wav2vec_model = AutoModel.from_pretrained("facebook/wav2vec2-base")
        wav2vec_available = True
        print("Wav2Vec2 model loaded successfully")
    except Exception as e:
        print(f"Error loading Wav2Vec2 model: {e}")
        wav2vec_available = False
        
    audio_analysis_available = True
except ImportError as e:
    print(f"Audio analysis will not be available: {e}")
    print("Install required packages with: pip install torch librosa transformers moviepy")
    audio_analysis_available = False


def preprocess_image(image_data):
    
    image = Image.open(io.BytesIO(image_data))

    image = image.resize((128, 128))

    img_array = np.array(image)
    img_array = img_array.astype('float32') / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def extract_frames(video_path, frame_interval=10):
    """Extract frames from video for analysis"""
    cap = cv2.VideoCapture(video_path)
    frames = []
    frame_count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = cv2.resize(frame, (128, 128))
            frame = frame.astype('float32') / 255.0
            frames.append(frame)
        frame_count += 1
        if len(frames) >= 10:
            break
            
    cap.release()
    return np.array(frames)


def analyze_audio(video_path):
    
    if not audio_analysis_available:
        return {
            "is_deepfake": bool(np.random.random() < 0.2),
            "confidence": float(np.random.random()),
            "note": "Audio analysis not available. Using random result."
        }
        
    if not wav2vec_available or not audio_model_available:
        return {
            "is_deepfake": bool(np.random.random() < 0.2),
            "confidence": float(np.random.random()),
            "note": "Audio models not available. Using random result."
        }
    
    try:
        audio_path = tempfile.mktemp(suffix='.wav')
        
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_path, codec="pcm_s16le", verbose=False, logger=None)
        
        speech, sr = librosa.load(audio_path, sr=16000) 
        
        inputs = wav2vec_processor(speech, return_tensors="pt", sampling_rate=16000).input_values
    
        with torch.no_grad():
            features = wav2vec_model(inputs).last_hidden_state
            prediction = audio_classifier(features).item()
        
        if os.path.exists(audio_path):
            os.unlink(audio_path)
        
        is_deepfake = prediction <= 0.5
        confidence = abs(prediction - 0.5) * 2
        
        return {
            "is_deepfake": bool(is_deepfake),
            "confidence": float(confidence),
            "note": "Audio analysis complete"
        }
        
    except Exception as e:
        print(f"Error in audio analysis: {e}")
        traceback.print_exc()
        return {
            "is_deepfake": bool(np.random.random() < 0.2),
            "confidence": float(np.random.random()),
            "error": str(e),
            "note": "Error in audio analysis. Using random result."
        }


@app.route('/detect-deepfake', methods=['POST'])
def detect_deepfake():
    if not request.json:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        if 'image' in request.json:
            image_b64 = request.json['image']
            image_data = base64.b64decode(image_b64)
            if model is None:
                is_deepfake = np.random.random() < 0.2
                confidence = np.random.random()
                
                return jsonify({
                    'is_deepfake': bool(is_deepfake),
                    'confidence': float(confidence),
                    'note': 'Using random detection as model is not available',
                    'media_type': 'image'
                })
            
            preprocessed_image = preprocess_image(image_data)
            
            prediction = model.predict(preprocessed_image)[0][0]
            is_deepfake = bool(prediction > 0.5)
            
            return jsonify({
                'is_deepfake': is_deepfake,
                'confidence': float(prediction),
                'media_type': 'image'
            })
            
        elif 'video' in request.json:
            video_b64 = request.json['video']
            video_data = base64.b64decode(video_b64)
            if model is None:
                is_deepfake = np.random.random() < 0.2
                confidence = np.random.random()
                
                return jsonify({
                    'is_deepfake': bool(is_deepfake),
                    'confidence': float(confidence),
                    'note': 'Using random detection as model is not available',
                    'media_type': 'video'
                })
            
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
                temp_video.write(video_data)
                temp_video_path = temp_video.name
            
            try:
                frames = extract_frames(temp_video_path)
                
                if len(frames) == 0:
                    return jsonify({'error': 'No frames could be extracted from video'}), 400
                
                predictions = []
                for frame in frames:
            
                    frame_expanded = np.expand_dims(frame, axis=0)
                    prediction = model.predict(frame_expanded)[0][0]
                    predictions.append(prediction)
                
                avg_prediction = float(np.mean(predictions))
                visual_is_deepfake = bool(avg_prediction > 0.5)
                visual_confidence = avg_prediction
                
                audio_result = analyze_audio(temp_video_path)
                audio_is_deepfake = audio_result["is_deepfake"]
                audio_confidence = audio_result["confidence"]
                
                if audio_confidence > visual_confidence:
                    is_deepfake = audio_is_deepfake
                    confidence = audio_confidence
                    dominant_factor = "audio"
                else:
                    is_deepfake = visual_is_deepfake
                    confidence = visual_confidence
                    dominant_factor = "visual"
                
                return jsonify({
                    'is_deepfake': is_deepfake,
                    'confidence': confidence,
                    'media_type': 'video',
                    'visual_result': {
                        'is_deepfake': visual_is_deepfake,
                        'confidence': float(visual_confidence)
                    },
                    'audio_result': {
                        'is_deepfake': audio_is_deepfake,
                        'confidence': float(audio_confidence)
                    },
                    'dominant_factor': dominant_factor
                })
                
            finally:

                if os.path.exists(temp_video_path):
                    os.unlink(temp_video_path)
        
        else:
            return jsonify({'error': 'No image or video data provided'}), 400
        
    except Exception as e:
        print(f"Error during detection: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':

    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
