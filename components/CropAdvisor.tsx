import React, { useState } from 'react';
import { getCropRecommendation } from '../services/geminiService';
import { Leaf, Sprout, MapPin, Loader2, Droplets } from 'lucide-react';

const CropAdvisor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    soil: 'Kali Mitti (Black Soil)',
    season: 'Rabi (Winter)',
    size: '1 Acre',
    location: '',
    water: 'Tube Well / Borewell'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location) {
      alert("कृपया अपना स्थान (Location) लिखें");
      return;
    }
    setLoading(true);
    setResult(null);
    const response = await getCropRecommendation(
      formData.soil, 
      formData.season, 
      formData.size, 
      formData.location,
      formData.water
    );
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-2xl font-bold text-kisan-800 mb-2 flex items-center gap-2">
        <Sprout className="w-6 h-6 text-kisan-600" />
        सटीक फसल सलाहकार (Precision Crop Advisor)
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        इज़राइल और नीदरलैंड्स की तकनीक आधारित फसल सुझाव प्राप्त करें।
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">मिट्टी का प्रकार (Soil Type)</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kisan-500 outline-none bg-white"
              value={formData.soil}
              onChange={(e) => setFormData({...formData, soil: e.target.value})}
            >
              <option>Kali Mitti (Black Soil)</option>
              <option>Lal Mitti (Red Soil)</option>
              <option>Jallodh Mitti (Alluvial Soil)</option>
              <option>Retili Mitti (Sandy Soil)</option>
              <option>Lateite Soil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">मौसम (Season)</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kisan-500 outline-none bg-white"
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
            >
              <option>Rabi (Winter - Oct to Mar)</option>
              <option>Kharif (Monsoon - Jul to Oct)</option>
              <option>Zaid (Summer - Mar to Jun)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">जमीन का आकार (Land Size)</label>
            <input 
              type="text" 
              placeholder="Ex: 2 Acre"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kisan-500 outline-none"
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">जल स्रोत (Water Source)</label>
            <div className="relative">
              <Droplets className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <select 
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kisan-500 outline-none bg-white"
                value={formData.water}
                onChange={(e) => setFormData({...formData, water: e.target.value})}
              >
                <option>Tube Well / Borewell</option>
                <option>Canal (Nahar)</option>
                <option>Rainfed (Varsha Aadharit)</option>
                <option>Drip Irrigation Installed</option>
                <option>Sprinkler System</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">स्थान (Location)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Ex: Indore, MP"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kisan-500 outline-none"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-kisan-600 hover:bg-kisan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center shadow-md shadow-kisan-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              सटीक खेती तकनीक खोजी जा रही है...
            </>
          ) : (
            <>
              <Leaf className="w-5 h-5 mr-2" />
              सलाह प्राप्त करें (Get Report)
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
          <h3 className="text-lg font-bold text-green-900 mb-3 border-b border-green-200 pb-2 flex items-center gap-2">
            <Sprout className="w-5 h-5" />
            AI सिफारिश (Recommendation):
          </h3>
          <div className="prose prose-sm prose-green max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAdvisor;