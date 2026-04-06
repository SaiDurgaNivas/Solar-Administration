import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, X, Sun, Zap, LayoutGrid, BatteryCharging, 
  Settings, AlertTriangle, TrendingUp, Cpu, Server, Trash2, Edit
} from "lucide-react";

function SolarPanels() {
  const [panels, setPanels] = useState(() => {
    const saved = sessionStorage.getItem('solar_panels');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  
  const [formData, setFormData] = useState({
    customer: "", location: "", capacity: "", panelCount: "", model: "Trina Vertex 550W", status: "Active"
  });

  useEffect(() => {
    sessionStorage.setItem('solar_panels', JSON.stringify(panels));
  }, [panels]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingPanel(null);
    setFormData({ customer: "", location: "", capacity: "", panelCount: "", model: "Trina Vertex 550W", status: "Active" });
    setIsModalOpen(true);
  };

  const openEditModal = (panel) => {
    setEditingPanel(panel);
    setFormData(panel);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer || !formData.capacity || !formData.panelCount) {
      alert("Please fill in Customer, Capacity, and Panel Count.");
      return;
    }

    if (editingPanel) {
      const updatedList = panels.map(p => p.id === editingPanel.id ? { ...p, ...formData } : p);
      setPanels(updatedList);
    } else {
      const newEntry = { id: Date.now(), ...formData };
      setPanels([newEntry, ...panels]);
    }
    setIsModalOpen(false);
    setEditingPanel(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hardware deployment?")) {
      setPanels(panels.filter((p) => p.id !== id));
    }
  };

  const totalPanels = panels.reduce((acc, curr) => acc + (parseInt(curr.panelCount) || 0), 0);
  const totalCapacity = panels.reduce((acc, curr) => acc + (parseFloat(curr.capacity) || 0), 0);
  const activeCount = panels.filter(p => p.status === "Active").length;
  const maintenanceCount = panels.filter(p => p.status === "Maintenance").length;

  const MAX_WAREHOUSE_STOCK = 15000;
  const currentAvailable = MAX_WAREHOUSE_STOCK - totalPanels;
  
  const dailyDeploymentAvg = panels.length > 0 ? Math.round(totalPanels / 14) : 0; // Mock 14 days of ops

  const filteredPanels = panels.filter((panel) =>
    panel.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    panel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (panel.model && panel.model.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-lg relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl shadow-lg">
                  <Server className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  {editingPanel ? "Update Hardware Spec" : "Deploy Hardware"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Target Customer</label>
                        <input type="text" name="customer" placeholder="Client Node Identifier" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.customer} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Deployment Zone</label>
                        <input type="text" name="location" placeholder="Sector / City" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.location} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Hardware Model</label>
                        <select name="model" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition appearance-none" value={formData.model || ''} onChange={handleInputChange}>
                            <option>Trina Vertex 550W</option>
                            <option>Jinko Tiger Pro 540W</option>
                            <option>Canadian Solar 600W</option>
                            <option>SunPower Maxeon 400W</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Total Capacity (kW)</label>
                        <input type="number" step="0.1" name="capacity" placeholder="e.g. 5.5" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.capacity} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Panel Quantity</label>
                        <input type="number" name="panelCount" placeholder="e.g. 14" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.panelCount} onChange={handleInputChange} required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Operational Status</label>
                        <select name="status" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition appearance-none" value={formData.status} onChange={handleInputChange}>
                            <option value="Active">🟢 Online & Active</option>
                            <option value="Pending">🟡 Pending Installation</option>
                            <option value="Maintenance">🔴 Hardware Maintenance</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition text-gray-300">Abort</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-extrabold shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition">
                    Commit Deployment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent flex items-center gap-3">
               <Cpu className="w-10 h-10 text-orange-400"/> Hardware Operations
            </h1>
            <p className="text-gray-400 text-lg mt-2 font-medium">Global inventory command center and live deployment metrics</p>
          </div>
          <button onClick={openAddModal} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-xl flex items-center gap-2 font-bold transition shadow-lg backdrop-blur-md">
              <Plus className="w-5 h-5" /> Execute Deployment
          </button>
        </motion.div>

        {/* Dynamic New Component: Inventory Status / Daily Specs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Massive Stats Block */}
            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-start justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] -mr-10 -mt-10 transition duration-500 group-hover:bg-orange-500/20"></div>
                    <div>
                        <p className="text-xs font-bold text-orange-400 tracking-widest uppercase mb-1">Total Available Panels</p>
                        <h2 className="text-4xl font-bold text-white mb-2">{currentAvailable.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                            <span className="text-gray-200">/ {MAX_WAREHOUSE_STOCK.toLocaleString()}</span> Warehouse Max
                        </div>
                    </div>
                    <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20"><LayoutGrid className="w-6 h-6 text-orange-400"/></div>
                </div>

                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-start justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] -mr-10 -mt-10 transition duration-500 group-hover:bg-blue-500/20"></div>
                    <div>
                        <p className="text-xs font-bold text-blue-400 tracking-widest uppercase mb-1">Total Output Capacity</p>
                        <h2 className="text-4xl font-bold text-white mb-2">{totalCapacity.toFixed(1)} <span className="text-xl text-gray-400">kW</span></h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                            <span>From {activeCount} Live Networks</span>
                        </div>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20"><Zap className="w-6 h-6 text-blue-400"/></div>
                </div>

                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-start justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] -mr-10 -mt-10 transition duration-500 group-hover:bg-green-500/20"></div>
                    <div>
                        <p className="text-xs font-bold text-green-400 tracking-widest uppercase mb-1">Deployed Hardware</p>
                        <h2 className="text-4xl font-bold text-white mb-2">{totalPanels.toLocaleString()} <span className="text-xl text-gray-400">Units</span></h2>
                        <div className="w-full bg-white/5 rounded-full h-1.5 mt-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-teal-400 h-1.5 rounded-full" style={{ width: `${Math.min((totalPanels/MAX_WAREHOUSE_STOCK)*100, 100)}%` }}></div>
                        </div>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20"><Sun className="w-6 h-6 text-green-400"/></div>
                </div>

                <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex items-start justify-between shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] -mr-10 -mt-10 transition duration-500 group-hover:bg-yellow-500/20"></div>
                    <div>
                        <p className="text-xs font-bold text-yellow-400 tracking-widest uppercase mb-1">Daily Usage Rate</p>
                        <h2 className="text-4xl font-bold text-white mb-2">{dailyDeploymentAvg} <span className="text-xl text-gray-400">/ Day</span></h2>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mt-3">
                            <TrendingUp className="w-3 h-3 text-yellow-500"/> Panels consumed per day
                        </div>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20"><BatteryCharging className="w-6 h-6 text-yellow-400"/></div>
                </div>
            </div>

            {/* Smart Alerts & Maintenance Block */}
            <div className="col-span-1 bg-gradient-to-br from-[#0f172a] to-red-500/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col relative overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-bold text-white tracking-wide">Hardware Intelligence</h3>
                </div>
                
                <div className="space-y-4 flex-1">
                    {maintenanceCount > 0 ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md">
                            <h4 className="text-red-400 font-bold text-sm tracking-wide">Maintenance Alert</h4>
                            <p className="text-gray-300 text-sm mt-1">{maintenanceCount} system(s) require immediate hardware replacement or calibration.</p>
                        </div>
                    ) : (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl backdrop-blur-md">
                            <h4 className="text-green-400 font-bold text-sm tracking-wide">Network Stable</h4>
                            <p className="text-gray-300 text-sm mt-1">Zero critical hardware failures detected across active deployments.</p>
                        </div>
                    )}

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-md">
                        <h4 className="text-blue-400 font-bold text-sm tracking-wide">Stock Prediction</h4>
                        <p className="text-gray-300 text-sm mt-1">At current usage rate ({dailyDeploymentAvg}/day), warehouse depletion estimated in <span className="font-bold text-white px-2 py-0.5 bg-blue-500/20 rounded">{dailyDeploymentAvg > 0 ? Math.round(currentAvailable / dailyDeploymentAvg) : "∞"} days</span>.</p>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Global Registry Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden mb-10">
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border-b border-white/10 gap-4">
             <h2 className="text-xl font-bold text-white tracking-wide">Global Hardware Registry</h2>
             <div className="relative w-full md:w-auto">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <input 
                     type="text" 
                     placeholder="Search node, location, or spec..." 
                     className="w-full md:w-80 bg-[#020617] border border-white/10 rounded-full py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition font-medium"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                 />
             </div>
          </div>

          <div className="p-2">
            {filteredPanels.length === 0 ? (
              <div className="text-center py-20 px-4">
                <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-400">Registry Empty</p>
                <p className="text-gray-500 mt-2 text-sm">Deploy your first hardware array configuration above.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5">
                      <th className="py-5 px-6 font-semibold">Deployment Node</th>
                      <th className="py-5 px-6 font-semibold">Location</th>
                      <th className="py-5 px-6 font-semibold">Hardware Spec</th>
                      <th className="py-5 px-6 font-semibold">Array Count</th>
                      <th className="py-5 px-6 font-semibold">Yield (kW)</th>
                      <th className="py-5 px-6 font-semibold">Pulse</th>
                      <th className="py-5 px-6 font-semibold text-right">Overrides</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredPanels.map((panel) => (
                      <tr key={panel.id} className="hover:bg-white/5 transition group">
                        <td className="py-5 px-6 font-bold text-gray-100 capitalize flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xs">
                                <Cpu className="w-5 h-5 text-orange-400" />
                            </div>
                            {panel.customer}
                        </td>
                        <td className="py-5 px-6 text-gray-400 font-medium">{panel.location}</td>
                        <td className="py-5 px-6 text-gray-400 text-sm">{panel.model}</td>
                        <td className="py-5 px-6">
                            <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-300 shadow-inner">
                                {panel.panelCount} UNITS
                            </span>
                        </td>
                        <td className="py-5 px-6 font-bold text-blue-400">{panel.capacity} kW</td>
                        <td className="py-5 px-6">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            panel.status === "Active" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            panel.status === "Maintenance" ? "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : 
                            "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}>
                            {panel.status}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditModal(panel)} className="p-2 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/30 text-blue-400 hover:text-white rounded-lg transition" title="Modify Spec">
                              <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(panel.id)} className="p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white rounded-lg transition" title="Terminate Deploy">
                              <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SolarPanels;
