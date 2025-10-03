'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, MapPin, CloudRain, TrendingUp, ArrowLeft, MessageCircle, Calendar, Target, Droplets } from 'lucide-react';
import Link from 'next/link';

const CropAdvisory: React.FC = () => {
  const [formData, setFormData] = useState({
    location: '',
    soilType: '',
    previousCrop: '',
    season: '',
    farmSize: '',
    irrigation: '',
    budget: ''
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const soilTypes = [
    { value: 'alluvial', label: 'Alluvial Soil' },
    { value: 'black', label: 'Black Soil' },
    { value: 'red', label: 'Red Soil' },
    { value: 'laterite', label: 'Laterite Soil' },
    { value: 'sandy', label: 'Sandy Soil' },
    { value: 'clay', label: 'Clay Soil' }
  ];

  const seasons = [
    { value: 'kharif', label: 'Kharif (Monsoon)' },
    { value: 'rabi', label: 'Rabi (Winter)' },
    { value: 'zaid', label: 'Zaid (Summer)' }
  ];

  const irrigationTypes = [
    { value: 'rain-fed', label: 'Rain-fed' },
    { value: 'tube-well', label: 'Tube well' },
    { value: 'canal', label: 'Canal' },
    { value: 'drip', label: 'Drip irrigation' },
    { value: 'sprinkler', label: 'Sprinkler' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateRecommendations = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockRecommendations = {
        primaryCrops: [
          {
            name: 'Rice',
            suitability: 95,
            expectedYield: '4-6 tons/hectare',
            profitability: 'High',
            reasons: ['Excellent for alluvial soil', 'Ideal for Kharif season', 'Good irrigation facility'],
            challenges: ['High water requirement', 'Pest infestation risk']
          }
        ],
        seasonalTips: [
          {
            icon: <Calendar className="w-6 h-6" />,
            title: 'Sowing Time',
            description: 'Sow from end of June to first week of July'
          }
        ],
        weatherAlerts: [
          {
            type: 'warning',
            message: 'Heavy rainfall expected in next 7 days - arrange drainage'
          }
        ]
      };
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Sprout className="w-10 h-10 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Crop Advisory</h1>
                  <p className="text-sm text-gray-600">Personalized farming suggestions</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-green-600" />
                Farm Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (District/State)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Example: Ludhiana, Punjab"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {soilTypes.map((soil) => (
                      <option key={soil.value} value={soil.value}>{soil.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={generateRecommendations}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating recommendations...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            {recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Sprout className="w-6 h-6 mr-3 text-green-600" />
                  Recommended Crops
                </h3>
                <div className="space-y-6">
                  {recommendations.primaryCrops.map((crop: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-gray-900">{crop.name}</h4>
                      <div className="text-2xl font-bold text-green-600">{crop.suitability}%</div>
                      <p className="text-green-600 font-semibold">{crop.expectedYield}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {!recommendations && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Waiting for Recommendations</h3>
                <p className="text-gray-500">Please fill in your farm information and get recommendations</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default CropAdvisory;
