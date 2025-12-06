import React, { useState, useRef } from 'react';
import { analyzePlantDisease } from '../services/geminiService';
import { Camera, Upload, AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';

const DiseaseDetector: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,") for API
        const base64Content = base64String.split(',')[1];
        setImage(base64String); // Keep full string for display
        analyzeImage(base64Content);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Content: string) => {
    setLoading(true);
    setAnalysis(null);
    const result = await analyzePlantDisease(base64Content);
    setAnalysis(result);
    setLoading(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-2xl font-bold text-red-700 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6" />
        रोग पहचान (Disease Doctor)
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        फसल की फोटो लें और तुरंत बीमारी और इलाज जानें।
      </p>

      {!image ? (
        <div 
          onClick={triggerFileInput}
          className="border-2 border-dashed border-gray-300 rounded-2xl h-64 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Camera className="w-8 h-8 text-kisan-600" />
          </div>
          <p className="text-gray-700 font-medium">फोटो अपलोड करें या कैमरा खोलें</p>
          <p className="text-gray-400 text-xs mt-2">Tap to scan crop</p>
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*" 
            capture="environment" // Opens back camera on mobile
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative rounded-xl overflow-hidden shadow-md max-h-80 mx-auto">
             <img src={image} alt="Uploaded Crop" className="w-full h-full object-cover" />
             <button 
               onClick={reset}
               className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 text-kisan-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">AI बीमारी की जाँच कर रहा है...</p>
              <p className="text-gray-400 text-sm">कृपया प्रतीक्षा करें</p>
            </div>
          ) : (
            analysis && (
              <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  रिपोर्ट (Diagnosis):
                </h3>
                <div className="prose prose-sm prose-orange max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {analysis}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetector;
