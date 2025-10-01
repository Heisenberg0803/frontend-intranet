import React, { useState, useEffect } from 'react';
import { Building2, Target, Eye, Heart } from 'lucide-react';
import Card from '../../components/ui/Card';
import { companyInfoApi } from '../../service/api';

const CompanyInfo = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    history: '',
    mission: '',
    vision: '',
    values: '',
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const { data } = await companyInfoApi.get();
        setInfo(data);
      } catch (error) {
        console.error('Failed to fetch company info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const values = info.values.split('\n').filter(value => value.trim());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Sobre a Empresa</h1>

      {/* História */}
      <Card>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nossa História</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {info.history}
            </div>
          </div>
        </div>
      </Card>

      {/* Missão */}
      <Card>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Missão</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {info.mission}
            </div>
          </div>
        </div>
      </Card>

      {/* Visão */}
      <Card>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Visão</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {info.vision}
            </div>
          </div>
        </div>
      </Card>

      {/* Valores */}
      <Card>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Valores</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <h3 className="font-medium text-gray-800 mb-2">{value}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompanyInfo;