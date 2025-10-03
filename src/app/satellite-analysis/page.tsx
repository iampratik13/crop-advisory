'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  MapPin, 
  Satellite, 
  BarChart3, 
  Download,
  Loader,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const SatelliteAnalysis: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
      setAnalysisResult(null);
    }
  }, []);

  const analyzeImage = async () => {
    if (!uploadedFile) {
      setError('Please select a file');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);

      const response = await axios.post('http://127.0.0.1:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAnalysisResult(response.data);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzePredefinedImage = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:5001/classify_predefined_image', {}, {
        timeout: 60000,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAnalysisResult(response.data);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-purple-200">
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
                <Satellite className="w-10 h-10 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Satellite Analysis</h1>
                  <p className="text-sm text-gray-600">Land use and crop monitoring</p>
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
                <Upload className="w-6 h-6 mr-3 text-purple-600" />
                Upload Satellite Image
              </h2>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".tiff,.tif,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Click to select file
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported: TIFF, PNG, JPEG
                    </p>
                  </label>
                </div>

                {uploadedFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800">
                        File selected: {uploadedFile.name}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={analyzeImage}
                  disabled={!uploadedFile || isAnalyzing}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Analyze Image
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-gray-500 mb-4">Or try with sample data</p>
                  <button
                    onClick={analyzePredefinedImage}
                    disabled={isAnalyzing}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Use Sample Image
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-6"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <p className="text-red-800">{error}</p>
                </div>
              </motion.div>
            )}

            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-purple-600" />
                  Analysis Results
                </h3>

                {analysisResult.predicted_class && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Primary Land Use</h4>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-800 font-medium text-lg">
                        {analysisResult.predicted_class}
                      </p>
                      {analysisResult.confidence && (
                        <p className="text-purple-600 text-sm mt-1">
                          Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {analysisResult.probabilities && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Detailed Classification</h4>
                    <div className="space-y-3">
                      {Object.entries(analysisResult.probabilities)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 5)
                        .map(([className, probability]) => (
                          <div key={className} className="flex items-center justify-between">
                            <span className="text-gray-700">{className}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full" 
                                  style={{ width: `${(probability as number) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-12 text-right">
                                {((probability as number) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {analysisResult.image_path && (
                  <div className="mt-6">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
                      <Download className="w-5 h-5 mr-2" />
                      Download Report
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {!analysisResult && !error && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <Satellite className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready for Analysis</h3>
                <p className="text-gray-500">Upload a satellite image to get detailed land use classification</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteAnalysis;
