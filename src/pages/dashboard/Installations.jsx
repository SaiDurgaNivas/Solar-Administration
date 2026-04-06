import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Activity, Zap, CheckCircle, PenTool, Database } from "lucide-react";
import api from "../../api/axiosConfig";

function Installations() {
  const [installations, setInstallations] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstallation, setEditingInstallation] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  
  const [formData, setFormData] = useState({
    system: "", location: "", status: "Pending", client: "", agent: "", date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 4000); // Auto-update every 4s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const [instRes, custRes, agentRes, billsRes] = await Promise.all([
        api.get('installations/'),
        api.get('users/?role=customer'),
        api.get('users/?role=agent'),
        api.get('bills/')
      ]);
      setInstallations(instRes.data);
      setCustomers(custRes.data);
      setAgents(agentRes.data);
      setBills(billsRes.data || []);
    } catch (err) {
      console.error("Error fetching installations dataset", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingInstallation(null);
    setFormData({ system: "", location: "", status: "Pending", client: "", agent: "", date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingInstallation(item);
    setFormData({
      system: item.system,
      location: item.location,
      status: item.status,
      client: item.client,
      agent: item.agent || "",
      date: item.date || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.client || !formData.system) {
      alert("Please fill in Client and System details.");
      return;
    }

    try {
      const payload = { ...formData };
      if (!payload.agent) payload.agent = null; // backend validation expects null, not empty string

      if (editingInstallation) {
        await api.put(`installations/${editingInstallation.id}/`, payload);
      } else {
        await api.post('installations/', payload);
      }
      setIsModalOpen(false);
      fetchData(); // Refresh the grid
    } catch (err) {
      console.error(err);
      alert("Failed to save. " + JSON.stringify(err.response?.data));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this physical installation reference?")) {
      try {
        await api.delete(`installations/${id}/`);
        setInstallations(installations.filter((i) => i.id !== id));
      } catch (err) {
        alert("Failed to wipe records.");
      }
    }
  };

  const cycleStatus = async (item) => {
    const statusCycle = ["Pending", "In Progress", "Completed", "Follow Up"];
    const currentIndex = statusCycle.indexOf(item.status);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const newStatus = statusCycle[nextIndex];

    try {
      // Optimistic UI update
      setInstallations(installations.map(i => i.id === item.id ? { ...i, status: newStatus } : i));
      await api.patch(`installations/${item.id}/`, { status: newStatus });
    } catch {
      fetchData(); // Revert on failure
    }
  };

  const filteredList = installations.filter(i => 
    i.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.system?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#020617] min-h-screen text-white font-sans overflow-x-hidden">
      
      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-lg relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Database className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-wide">
                  {editingInstallation ? "Update Installation" : "Queue Installation"}
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Client *</label>
                    <select name="client" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-white outline-none" value={formData.client} onChange={handleInputChange}>
                      <option value="" className="text-black">Select Customer</option>
                      {customers.map(c => <option key={c.id} value={c.id} className="text-black">{c.username} ({c.email})</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">System Topology *</label>
                    <input type="text" name="system" placeholder="e.g. 10kW Commercial Setup" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-white outline-none" value={formData.system} onChange={handleInputChange} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Assigned Field Agent</label>
                    <select name="agent" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-white outline-none" value={formData.agent} onChange={handleInputChange}>
                      <option value="" className="text-black">Unassigned</option>
                      {agents.map(a => <option key={a.id} value={a.id} className="text-black">{a.username}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Target Date</label>
                      <input type="date" name="date" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-gray-300 outline-none" value={formData.date} onChange={handleInputChange} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Status</label>
                      <select name="status" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-white outline-none" value={formData.status} onChange={handleInputChange}>
                        <option value="Pending" className="text-black">Pending</option>
                        <option value="In Progress" className="text-black">In Progress</option>
                        <option value="Completed" className="text-black">Completed</option>
                        <option value="Follow Up" className="text-black">Follow Up</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Geographic Location</label>
                    <input type="text" name="location" placeholder="Address/Coordinates" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-white outline-none" value={formData.location || ""} onChange={handleInputChange} />
                  </div>

              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-gray-300 transition">Discard</button>
                <button onClick={handleSubmit} className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:from-orange-400 hover:to-yellow-400 transition shadow-lg hover:shadow-orange-500/25">
                  {editingInstallation ? "Apply Mutation" : "Commit Record"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Infrastructure Matrix</h1>
          <p className="text-gray-400 mt-1">Manage physical hardware deployments</p>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onClick={openAddModal} 
          className="bg-white/10 border border-white/20 text-white px-5 py-3 rounded-xl hover:bg-white/20 transition flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Provision Setup
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0f172a]/60 backdrop-blur-md p-2 rounded-2xl shadow-lg mb-8 border border-white/10 flex items-center gap-3 w-full max-w-md">
         <div className="pl-3"><Search className="w-5 h-5 text-gray-500" /></div>
         <input 
            type="text" 
            placeholder="Search telemetry..." 
            className="w-full bg-transparent p-2 text-white outline-none placeholder-gray-600" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
         />
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Establishing secure link...</div>
        ) : installations.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Database className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-300 font-bold text-xl">Database Void</p>
            <p className="text-gray-500 mt-2">Initialize your first physical installation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5 bg-white/5">
                  <th className="py-5 px-6 font-semibold">Node Client</th>
                  <th className="py-5 px-6 font-semibold">Topology</th>
                  <th className="py-5 px-6 font-semibold">Handover Agent</th>
                  <th className="py-5 px-6 font-semibold">Date Completed</th>
                  <th className="py-5 px-6 font-semibold text-center">Payment</th>
                  <th className="py-5 px-6 font-semibold text-center">Status</th>
                  <th className="py-5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredList.map((item) => {
                  const clientBill = bills.find(b => b.client === item.client);
                  const payStatus = clientBill ? clientBill.status : "No Bill";
                  
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      key={item.id} 
                      className="hover:bg-white/5 transition"
                    >
                      <td className="py-5 px-6 font-medium text-gray-200 line-clamp-1">
                         <span className="capitalize">{item.client_name}</span>
                         <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{item.location || 'Unknown Sector'}</div>
                      </td>
                      <td className="py-5 px-6">
                          <span className="bg-white/5 text-gray-300 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold border border-white/10">
                              {item.system}
                          </span>
                      </td>
                      <td className="py-5 px-6 font-bold text-blue-400 text-xs tracking-wider uppercase">
                          {item.agent_name || <span className="italic opacity-50 text-gray-500">Unassigned</span>}
                      </td>
                      <td className="py-5 px-6 text-gray-300 font-bold text-xs">
                          {item.status === 'Completed' ? (
                             <span className="text-green-400 bg-green-500/10 px-2 py-1 rounded inline-block">{item.date}</span>
                          ) : (
                             <span>{item.date} <span className="text-gray-600 text-[10px] uppercase tracking-wider block mt-1">Target</span></span>
                          )}
                      </td>
                      <td className="py-5 px-6 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${
                             payStatus === 'Paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                             payStatus === 'Pending' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                             payStatus === 'Unpaid' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                             'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                             {payStatus}
                          </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button 
                          onClick={() => cycleStatus(item)} 
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold cursor-pointer transition border ${
                            item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 
                            item.status === 'Follow Up' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 
                            item.status === 'In Progress' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                          }`}
                        >
                          {item.status}
                        </button>
                      </td>
                      <td className="py-5 px-6 text-right space-x-3">
                        <button onClick={() => openEditModal(item)} className="p-2 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/30 text-blue-400 hover:text-white rounded-lg transition" title="Modify">
                            <PenTool className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-600 hover:text-red-500 font-semibold text-xs tracking-wider transition underline decoration-gray-700 hover:decoration-red-500 uppercase">
                           Purge
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Installations;
