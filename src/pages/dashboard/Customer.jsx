import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Users, ShieldCheck, Mail, UserCheck, ChevronDown, Trash2 } from "lucide-react";
import api from "../../api/axiosConfig";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(null); // holds customer being assigned
  const [selectedAgent, setSelectedAgent] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "customer"
  });

  useEffect(() => {
    fetchCustomers();
    fetchAgents();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('users/?role=customer');
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers directory", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get('users/?role=agent');
      setAgents(res.data);
    } catch (err) {
      console.error("Error fetching agents", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill all required credentials.");
      return;
    }
    try {
      await api.post('users/', formData);
      setIsModalOpen(false);
      setFormData({ username: "", email: "", password: "", role: "customer" });
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Registration failed. Ensure email/username is unique.");
    }
  };

  const handleAssign = async () => {
    if (!selectedAgent) {
      alert("Please select an agent to assign.");
      return;
    }
    try {
      // Patch all installations for this customer to assign the selected agent
      const instRes = await api.get('installations/');
      const customerInstalls = instRes.data.filter(i => i.client === assignModal.id);
      await Promise.all(
        customerInstalls.map(inst =>
          api.patch(`installations/${inst.id}/`, { agent: selectedAgent })
        )
      );
      alert(`✅ Agent assigned to ${assignModal.username} successfully!`);
      setAssignModal(null);
      setSelectedAgent("");
    } catch (err) {
      console.error(err);
      alert("Failed to assign agent.");
    }
  };

  const handleRemoveCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to remove this client? This cannot be undone.")) return;
    try {
      await api.delete(`users/${id}/`);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Failed to remove customer. They might be linked to existing records.");
    }
  };

  const filteredList = customers.filter(c =>
    c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (a.date_joined && b.date_joined) {
      return new Date(b.date_joined) - new Date(a.date_joined);
    }
    return b.id - a.id;
  });

  return (
    <div className="p-6 bg-[#020617] min-h-screen text-white font-sans overflow-x-hidden">

      {/* Register Client Modal */}
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
              className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-wide">Register Client</h2>
              </div>

              <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Username/ID *</label>
                    <input type="text" name="username" placeholder="solar_client_01" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-white outline-none" value={formData.username} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email *</label>
                    <input type="email" name="email" placeholder="client@sector.com" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-white outline-none" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Password *</label>
                    <input type="password" name="password" placeholder="••••••••" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 text-white outline-none tracking-widest" value={formData.password} onChange={handleInputChange} />
                  </div>

                  <div className="p-3 border border-orange-500/20 bg-orange-500/5 rounded-xl flex items-start gap-3 mt-4">
                     <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                     <p className="text-xs text-gray-400 leading-relaxed font-medium">This will instantly register the client in the master database and grant them access to their personal Node Hub.</p>
                  </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-gray-300 transition">Cancel</button>
                <button onClick={handleSubmit} className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:from-orange-400 hover:to-yellow-400 transition shadow-lg">
                  Register Client
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Agent Modal */}
      <AnimatePresence>
        {assignModal && (
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
              className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md relative"
            >
              <button onClick={() => { setAssignModal(null); setSelectedAgent(""); }} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <UserCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-wide">Assign Agent</h2>
                  <p className="text-gray-500 text-sm mt-1">Customer: <span className="text-white font-semibold capitalize">{assignModal.username}</span></p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Field Agent</label>
                <div className="relative">
                  <select
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none appearance-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    <option value="" className="text-black">-- Choose an Agent --</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id} className="text-black capitalize">
                        {agent.username.replace(/_/g, ' ')} ({agent.email})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {agents.length === 0 && (
                  <p className="text-xs text-yellow-400 mt-2 ml-1">⚠ No agents registered yet. Add agent accounts first.</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => { setAssignModal(null); setSelectedAgent(""); }} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-gray-300 transition">Cancel</button>
                <button onClick={handleAssign} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:from-blue-400 hover:to-indigo-400 transition shadow-lg">
                  Confirm Assignment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Client Directory</h1>
          <p className="text-gray-400 mt-1">Manage personnel, profiles and agent assignments</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-white/10 border border-white/20 text-white px-5 py-3 rounded-xl hover:bg-white/20 transition flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0f172a]/60 backdrop-blur-md p-2 rounded-2xl shadow-lg mb-8 border border-white/10 flex items-center gap-3 w-full max-w-md">
         <div className="pl-3"><Search className="w-5 h-5 text-gray-500" /></div>
         <input
            type="text"
            placeholder="Search customers..."
            className="w-full bg-transparent p-2 text-white outline-none placeholder-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
         />
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Syncing Directory...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-300 font-bold text-xl">Directory Void</p>
            <p className="text-gray-500 mt-2">Initialize your first client profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5 bg-white/5">
                  <th className="py-5 px-6 font-semibold">Customer</th>
                  <th className="py-5 px-6 font-semibold">Email</th>
                  <th className="py-5 px-6 font-semibold">Date & Time</th>
                  <th className="py-5 px-6 font-semibold">Contact & Address</th>
                  <th className="py-5 px-6 font-semibold text-center">Status</th>
                  <th className="py-5 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredList.map((item) => (
                  <motion.tr
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={item.id}
                    className="hover:bg-white/5 transition"
                  >
                    <td className="py-5 px-6 font-bold text-gray-200 capitalize">{item.username}</td>
                    <td className="py-5 px-6 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-600" /> {item.email}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-gray-400 text-xs font-medium">
                      {item.date_joined ? new Date(item.date_joined).toLocaleString() : "N/A"}
                    </td>
                    <td className="py-5 px-6 text-gray-400 text-sm">
                      <div className="flex flex-col gap-1">
                          <span className="text-gray-300 font-medium">{item.customer_profile?.phone || "No Phone"}</span>
                          <span className="text-xs text-gray-500 truncate max-w-[150px]" title={item.customer_profile?.address || "No Address"}>{item.customer_profile?.address || "No Address Added"}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-bold border bg-green-500/10 text-green-400 border-green-500/20">Active</span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setAssignModal(item); setSelectedAgent(""); }}
                          className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/30 text-blue-400 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          <UserCheck className="w-4 h-4" /> Assign Agent
                        </button>
                        <button
                          onClick={() => handleRemoveCustomer(item.id)}
                          className="flex items-center p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white rounded-xl transition-all"
                          title="Remove Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
