'use client'
import useUser from '@/hooks/useUser';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SocioEconomicInfo {
  id: string;
  gdpRange: number;
  population: number;
  incomeType: 'Low' | 'Mid' | 'High';
}

export default function CustomizationSettings() {
  
  const [values, setValues] = useState({
    updateFrequency: 'quarterly',
    socioEconomicInfos: [] as SocioEconomicInfo[],
    ethics: true,
    governance: true,
    innovation: true,
  });

  const { user, updateUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
      // Optionally reset the form or perform other actions here
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  };

  const toggleFocusArea = (area: keyof typeof values) => {
    setValues((prev) => ({
      ...prev,
      [area]: !prev[area],
    }));
  };

  const addSocioEconomicInfo = () => {
    setValues((prev) => ({
      ...prev,
      socioEconomicInfos: [
        ...prev.socioEconomicInfos,
        {
          id: uuidv4(),
          gdpRange: 5,
          population: 1000000,
          incomeType: 'Low',
        },
      ],
    }));
  };

  const removeSocioEconomicInfo = (id: string) => {
    setValues((prev) => ({
      ...prev,
      socioEconomicInfos: prev.socioEconomicInfos.filter(info => info.id !== id),
    }));
  };

  const updateSocioEconomicInfo = (
    id: string,
    field: keyof Omit<SocioEconomicInfo, 'id'>,
    value: any
  ) => {
    setValues((prev) => ({
      ...prev,
      socioEconomicInfos: prev.socioEconomicInfos.map(info =>
        info.id === id ? { ...info, [field]: value } : info
      ),
    }));
  };

  return (
    <div className="min-h-screen w-3/4 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-semibold mb-8 text-blue-500">Customization Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Update Frequency Section */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-blue-400">Update Frequency</label>
            <select
              value={values.updateFrequency}
              onChange={(e) => setValues({ ...values, updateFrequency: e.target.value })}
              className="w-full bg-blue-50 border border-blue-300 text-black rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="quarterly">Quarterly Updates</option>
              <option value="bi-annual">Bi-Annual Updates</option>
              <option value="annual">Annual Updates</option>
            </select>
          </div>

          {/* Socio-Economic Information Section */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-blue-500">Socio-Economic Information</label>
            
            <button
              type="button"
              onClick={addSocioEconomicInfo}
              className="bg-blue-300 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Socio-Economic Entry
            </button>

            {values.socioEconomicInfos.length > 0 && (
              <div className="space-y-6">
                {values.socioEconomicInfos.map((info, index) => (
                  <div key={info.id} className="border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-blue-600">Entry {index + 1}</h2>
                      <button
                        type="button"
                        onClick={() => removeSocioEconomicInfo(info.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-4">
                      {/* GDP Range */}
                      <div>
                        <label className="block text-md font-medium text-blue-400">GDP Range (5-8)</label>
                        <input
                          type="range"
                          min={5}
                          max={8}
                          step={0.1}
                          value={info.gdpRange}
                          onChange={(e) => updateSocioEconomicInfo(info.id, 'gdpRange', Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-blue-500">
                          <span>5</span>
                          <span>8</span>
                        </div>
                        <div className="mt-1 text-sm text-blue-600">Selected: {info.gdpRange.toFixed(1)}</div>
                      </div>

                      {/* Population */}
                      <div>
                        <label className="block text-md font-medium text-blue-400">Population</label>
                        <input
                          type="number"
                          value={info.population}
                          onChange={(e) => updateSocioEconomicInfo(info.id, 'population', Number(e.target.value))}
                          className="w-full bg-blue-50 border border-blue-300 text-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                          min={0}
                        />
                      </div>

                      {/* Income Type */}
                      <div>
                        <label className="block text-md font-medium text-blue-400">Income Type</label>
                        <select
                          value={info.incomeType}
                          onChange={(e) => updateSocioEconomicInfo(info.id, 'incomeType', e.target.value as 'Low' | 'Mid' | 'High')}
                          className="w-full bg-blue-50 border border-blue-300 text-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                          <option value="Low">Low</option>
                          <option value="Mid">Mid</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Focus Areas Section */}
          <div className="space-y-4">
            <label className="block text-lg font-medium text-blue-700">Focus Areas</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries({
                Ethics: 'ethics',
                Governance: 'governance',
                Innovation: 'innovation',
              }).map(([label, key]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={values[key as keyof typeof values] as boolean}
                    onChange={() => toggleFocusArea(key as keyof typeof values)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={key} className="ml-3 text-md text-blue-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button Section */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
