import React, { useState, useEffect } from 'react';
import { getGovSchemes } from '../services/geminiService';
import { Landmark, Loader2, ExternalLink } from 'lucide-react';

const GovSchemes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      const data = await getGovSchemes();
      setSchemes(data);
      setLoading(false);
    };
    fetchSchemes();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-2xl font-bold text-orange-700 mb-2 flex items-center gap-2">
        <Landmark className="w-6 h-6" />
        सरकारी योजनाएं (Govt Schemes)
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        खेती के लिए सरकार की नई सब्सिडी और योजनाओं की जानकारी।
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin mb-3" />
          <p className="text-gray-500">योजनाओं की सूची लोड हो रही है...</p>
        </div>
      ) : (
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 animate-in fade-in">
           <div className="prose prose-sm prose-orange max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
             {schemes}
           </div>
           
           <div className="mt-6 flex justify-end">
             <a href="https://pmkisan.gov.in/" target="_blank" rel="noreferrer" className="flex items-center text-sm font-bold text-orange-700 hover:text-orange-800">
               PM Kisan Portal <ExternalLink className="w-4 h-4 ml-1" />
             </a>
           </div>
        </div>
      )}
    </div>
  );
};

export default GovSchemes;