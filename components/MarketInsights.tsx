import React, { useState } from 'react';
import { getMarketInsights } from '../services/geminiService';
import { TrendingUp, DollarSign, Search, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for visualization since live API data is hard to mock purely in frontend without backend
const mockTrendData = [
  { month: 'Jan', price: 2100 },
  { month: 'Feb', price: 2150 },
  { month: 'Mar', price: 2050 },
  { month: 'Apr', price: 1950 }, // Harvest supply increase
  { month: 'May', price: 2000 },
  { month: 'Jun', price: 2200 },
];

const MarketInsights: React.FC = () => {
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!crop || !location) return;

    setLoading(true);
    setInsights(null);
    const data = await getMarketInsights(crop, location);
    setInsights(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          मंडी भाव अलर्ट (Market Trends)
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          अपनी फसल का सही दाम और बेचने का सही समय जानें।
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
           <input 
              type="text" 
              placeholder="फसल (e.g., Wheat, Tomato)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="मंडी/शहर (e.g., Nashik)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center sm:w-auto w-full"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
        </form>

        {/* Dummy Chart for Visual Appeal */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
           <h3 className="text-sm font-semibold text-gray-500 mb-4">Price Trend (Example Pattern)</h3>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={mockTrendData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} prefix="₹" />
                 <Tooltip 
                   contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                 />
                 <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} />
               </LineChart>
             </ResponsiveContainer>
           </div>
           <p className="text-xs text-gray-400 text-center mt-2">*This chart is a representative simulation.</p>
        </div>

        {insights && (
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
               <DollarSign className="w-5 h-5 text-blue-600" />
               बाज़ार विश्लेषण:
             </h3>
             <div className="prose prose-sm prose-blue max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
               {insights}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketInsights;
