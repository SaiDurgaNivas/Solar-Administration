import React, { useState, useEffect } from "react";

function SolarPanels() {
  // Load from sessionStorage or start empty
  const [panels, setPanels] = useState(() => {
    const saved = sessionStorage.getItem('solar_panels');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  
  const [formData, setFormData] = useState({
    customer: "", location: "", capacity: "", panelCount: "", model: "", status: "Active"
  });

  // Save to sessionStorage whenever panels change
  useEffect(() => {
    sessionStorage.setItem('solar_panels', JSON.stringify(panels));
  }, [panels]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingPanel(null);
    setFormData({ customer: "", location: "", capacity: "", panelCount: "", model: "", status: "Active" });
    setIsModalOpen(true);
  };

  const openEditModal = (panel) => {
    setEditingPanel(panel);
    setFormData(panel);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.customer || !formData.capacity || !formData.panelCount) {
      alert("Please fill in Customer, Capacity, and Panel Count.");
      return;
    }

    if (editingPanel) {
      // Update existing
      const updatedList = panels.map(p => 
        p.id === editingPanel.id ? { ...p, ...formData } : p
      );
      setPanels(updatedList);
    } else {
      // Add new
      const newEntry = { id: Date.now(), ...formData };
      setPanels([newEntry, ...panels]);
    }
    
    setIsModalOpen(false);
    setEditingPanel(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this configuration?")) {
      setPanels(panels.filter((p) => p.id !== id));
    }
  };

  // --- Stats Calculation ---
  const totalPanels = panels.reduce((acc, curr) => acc + (parseInt(curr.panelCount) || 0), 0);
  const totalCapacity = panels.reduce((acc, curr) => acc + (parseInt(curr.capacity) || 0), 0);
  const activeCount = panels.filter(p => p.status === "Active").length;

  const filteredPanels = panels.filter((panel) =>
    panel.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    panel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (panel.model && panel.model.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative animate-fade-in">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPanel ? "Edit Configuration" : "Add Panel Configuration"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input type="text" name="customer" placeholder="John Doe" className="w-full p-3 border rounded-lg" value={formData.customer} onChange={handleInputChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" name="location" placeholder="City" className="w-full p-3 border rounded-lg" value={formData.location} onChange={handleInputChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input type="text" name="model" placeholder="e.g. Trina 550W" className="w-full p-3 border rounded-lg" value={formData.model || ''} onChange={handleInputChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (kW)</label>
                    <input type="number" name="capacity" placeholder="5" className="w-full p-3 border rounded-lg" value={formData.capacity} onChange={handleInputChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Panel Count</label>
                    <input type="number" name="panelCount" placeholder="14" className="w-full p-3 border rounded-lg" value={formData.panelCount} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" className="w-full p-3 border rounded-lg bg-white" value={formData.status} onChange={handleInputChange}>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg border hover:bg-gray-100">Cancel</button>
              <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Solar Panels Inventory</h1>
          <p className="text-gray-500 mt-1">Manage hardware specifications and models</p>
        </div>
        <button onClick={openAddModal} className="bg-orange-500 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 shadow-md hover:shadow-lg transition flex items-center gap-2 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add Configuration
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
          </div>
          <div>
            <h2 className="text-gray-500 text-sm font-medium">Total Panels</h2>
            <p className="text-2xl font-bold text-gray-800">{totalPanels}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="text-gray-500 text-sm font-medium">Total Capacity</h2>
            <p className="text-2xl font-bold text-blue-600">{totalCapacity} kW</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h2 className="text-gray-500 text-sm font-medium">Active Systems</h2>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          </div>
          <div>
            <h2 className="text-gray-500 text-sm font-medium">Avg Panels/System</h2>
            <p className="text-2xl font-bold text-purple-600">
              {panels.length > 0 ? Math.round(totalPanels / panels.length) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 border border-gray-100">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
                type="text" 
                placeholder="Search by customer, location, or model..." 
                className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        {panels.length === 0 ? (
          <div className="text-center py-16 px-4">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            <p className="text-gray-500 font-medium text-lg">No panel configurations found</p>
            <p className="text-gray-400 text-sm mt-1">Get started by adding your first configuration.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Customer</th>
                  <th className="py-4 px-6 font-semibold">Location</th>
                  <th className="py-4 px-6 font-semibold">Model</th>
                  <th className="py-4 px-6 font-semibold">Count</th>
                  <th className="py-4 px-6 font-semibold">Capacity</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPanels.map((panel) => (
                  <tr key={panel.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium text-gray-800">{panel.customer}</td>
                    <td className="py-4 px-6 text-gray-600">{panel.location}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{panel.model}</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                        {panel.panelCount} Units
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-800">{panel.capacity} kW</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        panel.status === "Active" ? "bg-green-50 text-green-700 border border-green-200" :
                        panel.status === "Maintenance" ? "bg-red-50 text-red-700 border border-red-200" : 
                        "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      }`}>
                        {panel.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button onClick={() => openEditModal(panel)} className="text-blue-500 hover:text-blue-700 font-medium text-sm hover:underline">Edit</button>
                      <button onClick={() => handleDelete(panel.id)} className="text-red-500 hover:text-red-700 font-medium text-sm hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SolarPanels;
