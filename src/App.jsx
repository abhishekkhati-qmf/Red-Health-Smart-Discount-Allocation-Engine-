import React, { useState } from 'react';
import { Plus, Trash2, Calculator, Download, Users } from 'lucide-react';

function App() {
  const [siteKitty, setSiteKitty] = useState(10000);
  const [salesAgents, setSalesAgents] = useState([
    {
      id: 'A1',
      performanceScore: 90,
      seniorityMonths: 18,
      targetAchievedPercent: 85,
      activeClients: 12
    },
    {
      id: 'A2',
      performanceScore: 70,
      seniorityMonths: 6,
      targetAchievedPercent: 60,
      activeClients: 8
    }
  ]);
  const [allocations, setAllocations] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const addAgent = () => {
    const newId = `A${salesAgents.length + 1}`;
    setSalesAgents([
      ...salesAgents,
      {
        id: newId,
        performanceScore: 75,
        seniorityMonths: 12,
        targetAchievedPercent: 70,
        activeClients: 5
      }
    ]);
  };

  const removeAgent = (id) => {
    setSalesAgents(salesAgents.filter((agent) => agent.id !== id));
  };

  const updateAgent = (id, field, value) => {
    setSalesAgents(
      salesAgents.map((agent) =>
        agent.id === id ? { ...agent, [field]: value } : agent
      )
    );
  };


 const calculateAllocations = () => {
  if (salesAgents.length === 0 || siteKitty <= 0) return;

 
  const performanceScores = salesAgents.map(a => a.performanceScore);
  const seniorityValues = salesAgents.map(a => a.seniorityMonths);
  const targetValues = salesAgents.map(a => a.targetAchievedPercent);
  const clientValues = salesAgents.map(a => a.activeClients);


  const normalize = (val, min, max) => (max === min ? 1 : (val - min) / (max - min));

  const [minPerf, maxPerf] = [Math.min(...performanceScores), Math.max(...performanceScores)];
  const [minSen, maxSen] = [Math.min(...seniorityValues), Math.max(...seniorityValues)];
  const [minTarget, maxTarget] = [Math.min(...targetValues), Math.max(...targetValues)];
  const [minClient, maxClient] = [Math.min(...clientValues), Math.max(...clientValues)];

  const weights = {
    performance: 0.35,
    seniority: 0.2,
    target: 0.3,
    clients: 0.15
  };


  const agentScores = salesAgents.map(agent => {
    const normalized = {
      performance: normalize(agent.performanceScore, minPerf, maxPerf),
      seniority: normalize(agent.seniorityMonths, minSen, maxSen),
      target: normalize(agent.targetAchievedPercent, minTarget, maxTarget),
      clients: normalize(agent.activeClients, minClient, maxClient),
    };

    const compositeScore =
      normalized.performance * weights.performance +
      normalized.seniority * weights.seniority +
      normalized.target * weights.target +
      normalized.clients * weights.clients;

    return { ...agent, compositeScore, normalized };
  });

  const totalComposite = agentScores.reduce((sum, a) => sum + a.compositeScore, 0);

  const finalAllocations = agentScores.map(agent => {
    const proportion = totalComposite > 0 ? agent.compositeScore / totalComposite : 1 / salesAgents.length;
    const assignedDiscount = Math.round(siteKitty * proportion);

    
    let justification = '';

    if (agent.performanceScore >= 85 && agent.seniorityMonths >= 12) {
      justification = 'Consistently high performance and long-term contribution';
    } else if (agent.performanceScore >= 70) {
      justification = 'Moderate performance with potential for growth';
    } else {
      justification = 'Needs improvement but has opportunity to grow';
    }

    return {
      id: agent.id,
      assignedDiscount,
      justification
    };
  });

  setAllocations(finalAllocations); 
  setShowResults(true);
};




  const exportResults = () => {
    const data = {
      siteKitty,
      totalAllocated: allocations.reduce((sum, a) => sum + a.assignedDiscount, 0),
      allocations
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'discount-allocation-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalAllocated = allocations.reduce((sum, a) => sum + a.assignedDiscount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl mb-6">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Smart Discount Allocation Engine
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Intelligently distribute discount budgets among sales agents based on performance,
            seniority, target achievement, and client management capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-emerald-600 rounded-full"></div>
                Discount Kitty Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Available Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={siteKitty}
                    onChange={(e) => setSiteKitty(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-semibold"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-emerald-600 rounded-full"></div>
                  Sales Agents ({salesAgents.length})
                </h2>
                <button
                  onClick={addAgent}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add Agent
                </button>
              </div>

              <div className="space-y-4">
                {salesAgents.map((agent, index) => (
                  <div key={agent.id} className="bg-gray-50 rounded-xl p-5 border-2 border-transparent hover:border-blue-200 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {agent.id}
                        </div>
                        <h3 className="font-semibold text-gray-800">Agent {agent.id}</h3>
                      </div>
                      {salesAgents.length > 1 && (
                        <button
                          onClick={() => removeAgent(agent.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Performance Score (0-100)
                        </label>
                        <input
                          type="number"
                          value={agent.performanceScore}
                          onChange={(e) => updateAgent(agent.id, 'performanceScore', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seniority (months)
                        </label>
                        <input
                          type="number"
                          value={agent.seniorityMonths}
                          onChange={(e) => updateAgent(agent.id, 'seniorityMonths', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Target Achievement (%)
                        </label>
                        <input
                          type="number"
                          value={agent.targetAchievedPercent}
                          onChange={(e) => updateAgent(agent.id, 'targetAchievedPercent', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          min="0"
                          max="200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Active Clients
                        </label>
                        <input
                          type="number"
                          value={agent.activeClients}
                          onChange={(e) => updateAgent(agent.id, 'activeClients', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={calculateAllocations}
                  disabled={salesAgents.length === 0}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Allocations
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {showResults && (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Allocation Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Total Budget:</span>
                      <span className="font-bold">₹{siteKitty.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Allocated:</span>
                      <span className="font-bold">₹{totalAllocated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Remaining:</span>
                      <span className="font-bold">₹{(siteKitty - totalAllocated).toLocaleString()}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/30">
                      <div className="flex justify-between items-center text-sm">
                        <span>Efficiency:</span>
                        <span className="font-bold">
                          {((totalAllocated / siteKitty) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Individual Allocations
                    </h3>
                    <button
                      onClick={exportResults}
                      className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>

                  <div className="space-y-4">
                    {allocations.map((allocation) => (
                      <div key={allocation.id} className="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {allocation.id}
                            </div>
                            <h4 className="font-semibold text-gray-800">Agent {allocation.id}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">
                              ₹{allocation.assignedDiscount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {((allocation.assignedDiscount / siteKitty) * 100).toFixed(1)}% of budget
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {allocation.justification}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!showResults && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-500">
                  Configure your sales agents and click "Calculate Allocations" to see the intelligent distribution.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

