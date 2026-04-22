import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  Search, Plus, X, Sun, Zap, LayoutGrid, BatteryCharging, 
  Settings, AlertTriangle, TrendingUp, Cpu, Server, Trash2, Edit,
  Boxes, IndianRupee, Link, HardDrive, Filter
} from "lucide-react";

// API URL (Make sure this matches your backend)
const API_BASE_URL = "http://localhost:8000/api/hardware/";

function SolarPanels() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", category: "panel", specification: "", price_per_unit: 0, stock_quantity: 0, brand: ""
  });

  // Categories for the system
  const categories = [
    { id: 'all', name: 'All Hardware', icon: Boxes },
    { id: 'panel', name: 'Solar Panels', icon: Sun },
    { id: 'battery', name: 'Batteries', icon: BatteryCharging },
    { id: 'wire', name: 'Wires & Cables', icon: Link },
    { id: 'rod', name: 'Mounting Rods', icon: HardDrive },
    { id: 'inverter', name: 'Inverters', icon: Zap },
    { id: 'other', name: 'Other Parts', icon: Settings },
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching hardware:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", category: "panel", specification: "", price_per_unit: 0, stock_quantity: 0, brand: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API_BASE_URL}${editingItem.id}/`, formData);
      } else {
        await axios.post(API_BASE_URL, formData);
      }
      fetchMaterials();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving hardware:", error);
      alert("Failed to save hardware. Check backend logs.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this material from registry?")) {
      try {
        await axios.delete(`${API_BASE_URL}${id}/`);
        fetchMaterials();
      } catch (error) {
        console.error("Error deleting hardware:", error);
      }
    }
  };

  // Stats calculation
  const totalStock = materials.reduce((acc, curr) => acc + (parseInt(curr.stock_quantity) || 0), 0);
  const totalValue = materials.reduce((acc, curr) => acc + (parseFloat(curr.price_per_unit) * parseInt(curr.stock_quantity) || 0), 0);
  const outOfStockCount = materials.filter(m => m.stock_quantity <= 0).length;

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

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
                  <Boxes className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  {editingItem ? "Edit Material Spec" : "Add New Material"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Material Name</label>
                        <input type="text" name="name" placeholder="e.g. Copper Wire 4sqmm" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Category</label>
                        <select name="category" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition appearance-none" value={formData.category} onChange={handleInputChange}>
                            <option value="panel">Solar Panel</option>
                            <option value="battery">Battery</option>
                            <option value="wire">Wire / Cable</option>
                            <option value="rod">Mounting Rod</option>
                            <option value="inverter">Inverter</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Brand</label>
                        <input type="text" name="brand" placeholder="e.g. Polycab, TATA" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.brand} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Stock Quantity</label>
                        <input type="number" name="stock_quantity" placeholder="Quantity" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.stock_quantity} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Price per Unit (₹)</label>
                        <input type="number" name="price_per_unit" placeholder="Price" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.price_per_unit} onChange={handleInputChange} required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1">Specifications</label>
                        <textarea name="specification" rows="2" placeholder="e.g. 550W Monocrystalline, 150Ah Tubuller" className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition" value={formData.specification} onChange={handleInputChange}></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition text-gray-300">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-extrabold shadow-[0_0_15px_rgba(249,115,22,0.4)] transition">
                    {editingItem ? "Update Item" : "Add to Registry"}
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
               <Boxes className="w-10 h-10 text-orange-400"/> Hardware Registry
            </h1>
            <p className="text-gray-400 text-lg mt-2 font-medium">Manage all types of solar components, wiring, and inventory</p>
          </div>
          <button onClick={openAddModal} className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-3.5 rounded-xl flex items-center gap-2 font-black transition shadow-lg shadow-orange-500/20">
              <Plus className="w-5 h-5" /> Add New Material
          </button>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-[#0f172a] border border-white/5 p-6 rounded-[2rem]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Items in Inventory</p>
              <p className="text-4xl font-black text-white">{materials.length}</p>
           </div>
           <div className="bg-[#0f172a] border border-white/5 p-6 rounded-[2rem]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Stock Count</p>
              <p className="text-4xl font-black text-orange-500">{totalStock.toLocaleString()}</p>
           </div>
           <div className="bg-[#0f172a] border border-white/5 p-6 rounded-[2rem]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Estimated Net Value</p>
              <p className="text-4xl font-black text-green-500">₹{totalValue.toLocaleString()}</p>
           </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${
                activeCategory === cat.id 
                ? "bg-white text-black border-white shadow-xl" 
                : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
              }`}
            >
              <cat.icon className="w-4 h-4" /> {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#0f172a] p-6 rounded-t-[2.5rem] border-x border-t border-white/5 gap-4">
           <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search by name or brand..." 
                  className="w-full bg-black/40 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-orange-500/50 transition font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
           </div>
           <p className="text-gray-500 text-xs font-bold">Showing {filteredMaterials.length} Results</p>
        </div>

        {/* Material Registry Table */}
        <div className="bg-[#0f172a] border border-white/5 rounded-b-[2.5rem] overflow-hidden shadow-2xl mb-20">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="h-64 flex items-center justify-center font-bold text-orange-400">Syncing with Central Registry...</div>
            ) : filteredMaterials.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-600 font-bold italic">
                 No items found in this category. Click "Add New Material" to begin.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                    <th className="py-6 px-8">Material / Spec</th>
                    <th className="py-6 px-8">Category</th>
                    <th className="py-6 px-8">Stock</th>
                    <th className="py-6 px-8">Unit Price</th>
                    <th className="py-6 px-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMaterials.map((item) => (
                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 px-8">
                        <div>
                          <p className="text-white font-bold text-base group-hover:text-orange-400 transition-colors uppercase tracking-tight">{item.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{item.brand || 'No Brand'} • {item.specification || 'No Spec'}</p>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                         <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-md text-[10px] font-black uppercase text-gray-400">
                            {item.category}
                         </span>
                      </td>
                      <td className="py-6 px-8">
                         <p className={`font-black text-lg ${item.stock_quantity <= 5 ? 'text-red-500' : 'text-white'}`}>
                            {item.stock_quantity} <span className="text-[10px] text-gray-500 font-bold ml-1">Units</span>
                         </p>
                      </td>
                      <td className="py-6 px-8 font-bold text-green-500 text-lg">
                        ₹{parseFloat(item.price_per_unit).toLocaleString()}
                      </td>
                      <td className="py-6 px-8 text-right">
                         <div className="flex justify-end gap-2">
                           <button onClick={() => openEditModal(item)} className="p-2 bg-white/5 hover:bg-orange-500 hover:text-black rounded-lg transition-all border border-white/5">
                              <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-white/5">
                              <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolarPanels;

