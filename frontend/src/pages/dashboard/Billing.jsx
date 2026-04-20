import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, CheckCircle, Clock, Plus, X, Building, Package, IndianRupee } from "lucide-react";
import api from "../../api/axiosConfig";

function Billing() {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoiceMaterials, setSelectedInvoiceMaterials] = useState(null);

  // Form State for creating a new Invoice
  const [billForm, setBillForm] = useState({
     client: "",
     bill_no: "",
     units: 0,
     amount: 0,
     loan: 0,
     subsidy: 0,
     downpayment: 0,
     status: "Unpaid"
  });

  useEffect(() => {
    fetchBills();
    const interval = setInterval(() => fetchBills(false), 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchBills = async (showLoader = true) => {
    try {
        if (showLoader) setLoading(true);
        const [billsRes, custRes, bookingsRes] = await Promise.all([
            api.get('bills/'),
            api.get('users/?role=customer'),
            api.get('bookings/')
        ]);
        let billsData = billsRes.data;
        const demoStatus = localStorage.getItem('demo_bill_status');
        if (demoStatus) {
            billsData = [{
                id: 'demo-bill-1',
                bill_no: 'DEMO-INV-001',
                client_name: 'nivasreddynr',
                date: new Date().toISOString().split('T')[0],
                units: 0,
                amount: 158000,
                status: demoStatus
            }, ...billsData];
        }
        
        setBills(billsData);
        setCustomers(custRes.data);
        setBookings(bookingsRes.data);
    } catch (err) {
        console.error("Failed to fetch billing data", err);
    } finally {
        setLoading(false);
    }
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setBillForm(prev => {
          const updated = { ...prev, [name]: value };
          
          // Auto-calculate if client is changed
          if (name === "client" && value) {
              const clientBooking = bookings.find(b => b.client === parseInt(value));
              if (clientBooking && clientBooking.documents) {
                  const docs = clientBooking.documents;
                  const panelCount = parseInt(docs.panel_count || docs.panelCount || 1);
                  const rodCount = parseInt(docs.rod_count || 0);
                  
                  const baseCost = PANEL_UNIT_COST * panelCount + INVERTER_COST + BATTERY_COST + ROD_UNIT_COST * rodCount + WIRE_COST;
                  const subsidy = 78000;
                  const loan = 40000;
                  
                  updated.amount = baseCost - subsidy - loan;
                  updated.loan = loan;
                  updated.subsidy = subsidy;
                  updated.units = panelCount * 100; // Demo estimate
              }
          }
          return updated;
      });
  };

  const generateInvoice = async () => {
      if (!billForm.client || !billForm.bill_no || !billForm.amount) {
          alert("Client, Bill No, and Amount are strictly required.");
          return;
      }
      try {
          const payload = {
              ...billForm,
              units: parseFloat(billForm.units) || 0,
              amount: parseFloat(billForm.amount) || 0,
              loan: parseFloat(billForm.loan) || 0,
              subsidy: parseFloat(billForm.subsidy) || 0,
              downpayment: parseFloat(billForm.downpayment) || 0
          };
          await api.post('bills/', payload);
          setIsModalOpen(false);
          setBillForm({ client: "", bill_no: "", units: 0, amount: 0, loan: 0, subsidy: 0, downpayment: 0, status: "Unpaid" });
          fetchBills();
      } catch (err) {
           console.error("Invoice Error:", err.response?.data);
           alert("Invoice generation failed: " + JSON.stringify(err.response?.data || err.message));
      }
  };

  // 🔍 SEARCH
  const filteredBills = bills.filter((bill) =>
    (bill.bill_no?.toLowerCase().includes(search.toLowerCase())) ||
    (bill.client_name?.toLowerCase().includes(search.toLowerCase()))
  );

  // 💰 TOTALS
  const totalPaid = bills.filter((b) => b.status === "Paid").reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
  const totalPending = bills.filter((b) => b.status === "Unpaid").reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

  // 🔩 MATERIALS COST from bookings (loan = material cost approximation from booking docs)
  const PANEL_UNIT_COST = 8500;   // ₹ per panel
  const INVERTER_COST   = 12000;  // ₹ per inverter
  const BATTERY_COST    = 7000;   // ₹ per battery
  const ROD_UNIT_COST   = 350;    // ₹ per rod
  const WIRE_COST       = 2500;   // ₹ flat wiring cost

  const bookingsWithDocs = bookings.filter(b => b.documents);
  const totalMaterialsCost = bookingsWithDocs.reduce((sum, b) => {
    const panelCount = parseInt(b.documents?.panel_count || b.documents?.panelCount || 1);
    const rodCount   = parseInt(b.documents?.rod_count || 0);
    return sum + PANEL_UNIT_COST * panelCount + INVERTER_COST + BATTERY_COST + ROD_UNIT_COST * rodCount + WIRE_COST;
  }, 0);

  const openInvoice = (bill) => {
      const clientBooking = bookings.find(b => (b.client === bill.client || b.client_name === bill.client_name) && b.documents);
      if (clientBooking) {
          const docs = clientBooking.documents;
          const panelCount = parseInt(docs.panel_count || docs.panelCount || 1);
          const rodCount = parseInt(docs.rod_count || 0);
          
          const materialTotal = PANEL_UNIT_COST * panelCount + INVERTER_COST + BATTERY_COST + ROD_UNIT_COST * rodCount + WIRE_COST;
          
          setSelectedInvoiceMaterials({
              panels: { type: docs.panel_type || 'Monocrystalline', count: panelCount, cost: PANEL_UNIT_COST * panelCount },
              inverter: { type: docs.inverter_type || 'Standard Hybrid', cost: INVERTER_COST },
              battery: { type: docs.battery_type || 'Lithium-Ion 5kWh', cost: BATTERY_COST },
              rods: { type: docs.rod_type || 'Earth GI', count: rodCount, cost: ROD_UNIT_COST * rodCount },
              wiring: { type: docs.wire_type || 'Heavy Duty DC', cost: WIRE_COST },
              total: materialTotal
          });
      } else {
          // Default fallbacks if no docs found
          setSelectedInvoiceMaterials({
              panels: { type: 'Solar Grid Panels', count: 1, cost: 85000 },
              inverter: { type: 'Smart Inverter', cost: 45000 },
              battery: { type: 'Energy Storage', cost: 25000 },
              rods: { type: 'Grounding Kit', count: 2, cost: 2000 },
              wiring: { type: 'Secure Cabling', cost: 1000 },
              total: 158000
          });
      }
      setSelectedInvoice(bill);
  };

  return (
    <div className="bg-[#020617] min-h-screen p-6 font-sans text-white overflow-x-hidden">

      {/* 🚀 MODAL: Generate Invoice */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-wide">Generate Revenue Ledger</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Client Profile *</label>
                    <select name="client" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none" value={billForm.client} onChange={handleInputChange}>
                      <option value="" className="text-black">Select Target Client</option>
                      {customers.map(c => <option key={c.id} value={c.id} className="text-black">{c.username} ({c.email})</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Ledger / Bill No *</label>
                    <input type="text" name="bill_no" placeholder="INV-2026-X" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none" value={billForm.bill_no} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Power Units (kWh)</label>
                    <input type="number" name="units" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none" value={billForm.units} onChange={handleInputChange} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Net Amount Charge *</label>
                    <input type="number" name="amount" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none" value={billForm.amount} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Loan Recovery</label>
                    <input type="number" name="loan" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none" value={billForm.loan} onChange={handleInputChange} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Govt Subsidy Applied</label>
                    <input type="number" name="subsidy" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none" value={billForm.subsidy} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 ml-1">Clearance Status</label>
                    <select name="status" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-white outline-none" value={billForm.status} onChange={handleInputChange}>
                        <option value="Unpaid" className="text-black">Unpaid (Pending Collection)</option>
                        <option value="Paid" className="text-black">Paid (Cleared)</option>
                    </select>
                  </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-gray-300 transition">Discard</button>
                <button onClick={generateInvoice} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:from-blue-400 hover:to-indigo-400 transition shadow-lg hover:shadow-blue-500/25">
                  Publish Ledger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER EXCELLENCE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3">
             <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                 <Building className="w-8 h-8 text-blue-400" />
             </div>
             <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">Corporate Ledger</h1>
                <p className="text-gray-400 mt-1 font-medium text-sm">
                  Track organizational revenue targets and unpaid invoices globally.
                </p>
             </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                    type="text"
                    placeholder="Query client or invoice ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#0f172a]/60 border border-white/10 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner text-white"
                />
            </div>
            
            <button onClick={() => {
                setBillForm(prev => ({ ...prev, bill_no: `INV-${Date.now().toString().slice(-6)}` }));
                setIsModalOpen(true);
            }} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl transition flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/25 shrink-0">
               <Plus className="w-5 h-5" /> Issue
            </button>
        </motion.div>
      </div>

      {/* MACRO SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
            { tag: "Outstanding Debt", value: `₹${totalPending.toLocaleString()}`, color: "text-red-400", sub: `${bills.filter(b => b.status === "Unpaid").length} active ledgers` },
            { tag: "Resolved Revenue", value: `₹${totalPaid.toLocaleString()}`, color: "text-green-400", sub: `${bills.filter(b => b.status === "Paid").length} settled ledgers` },
            { tag: "Network Invoices", value: bills.length, color: "text-white", sub: "Total volume generated" },
            { tag: "Total Materials Cost", value: `₹${totalMaterialsCost.toLocaleString()}`, color: "text-orange-400", sub: `${bookingsWithDocs.length} installations tracked` },
        ].map((stat, i) => (
            <motion.div 
               key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
               className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:border-white/20 transition"
            >
               <div>
                  <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-1">{stat.tag}</p>
                  {loading ? <div className="h-8 w-24 bg-white/5 animate-pulse rounded my-2"></div> : <h2 className={`text-4xl font-extrabold ${stat.color} my-1`}>{stat.value}</h2>}
               </div>
               <p className="text-xs text-gray-500 mt-2 font-medium">{stat.sub}</p>
            </motion.div>
        ))}
      </div>

      {/* MATRIX TABLE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
      >
        {loading ? (
            <div className="p-16 space-y-4 text-center text-gray-500 animate-pulse font-medium">Synchronizing Global Financial Directory...</div>
        ) : filteredBills.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-xl">Revenue Directory Empty</p>
            <p className="text-gray-600 mt-2">Generate invoices to initiate cash flow tracking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                  <th className="p-5 font-semibold">Ledger ID</th>
                  <th className="p-5 font-semibold">Client Link</th>
                  <th className="p-5 font-semibold">Timeline</th>
                  <th className="p-5 font-semibold">KWh Metric</th>
                  <th className="p-5 font-semibold text-right">Net Charge</th>
                  <th className="p-5 font-semibold text-center">Clearance</th>
                  <th className="p-5 font-semibold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-white/5 transition group cursor-pointer">
                    <td className="p-5 font-bold text-gray-200">{bill.bill_no}</td>
                    <td className="p-5 text-gray-400 font-medium">@{bill.client_name || 'unknown_node'}</td>
                    <td className="p-5 text-gray-500 text-sm tracking-wide">{bill.date || 'Syncing...'}</td>
                    <td className="p-5 text-gray-300">{bill.units} kWh</td>
                    <td className="p-5 font-bold text-right text-white">₹{parseFloat(bill.amount).toLocaleString()}</td>
                    
                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border ${
                            bill.status === "Paid"
                              ? "bg-green-500/10 text-green-400 border-green-500/30"
                              : bill.status?.includes("Slot")
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/10 text-red-500 border-red-500/30"
                        }`}>
                          {bill.status}
                        </span>
                        {bill.status === "Paid" && bill.paid_at && (
                          <span className="text-[10px] text-gray-500 font-bold font-mono">
                            {new Date(bill.paid_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                       {bill.status === "Paid" ? (
                         <button 
                            onClick={(e) => { e.stopPropagation(); openInvoice(bill); }}
                            className="bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-blue-500/30 ml-auto"
                         >
                            <FileText className="w-4 h-4" /> View Invoice
                         </button>
                       ) : (
                         <span className="text-gray-600 text-xs font-bold italic pr-4">Drafting...</span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* MATERIALS COST BREAKDOWN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-500/20 overflow-hidden mt-8"
      >
        <div
          className="p-6 flex justify-between items-center bg-orange-500/5 border-b border-orange-500/20 cursor-pointer"
          onClick={() => setShowMaterials(v => !v)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <Package className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Materials Cost Breakdown</h2>
              <p className="text-xs text-gray-500 mt-0.5">Per-booking hardware & wiring cost estimates</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-extrabold text-orange-400">₹{totalMaterialsCost.toLocaleString()}</span>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{showMaterials ? '▲ Collapse' : '▼ Expand'}</span>
          </div>
        </div>

        <AnimatePresence>
          {showMaterials && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              {bookingsWithDocs.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 font-bold">No booking documents available yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                        <th className="p-5 font-semibold">Customer</th>
                        <th className="p-5 font-semibold">Panel Type</th>
                        <th className="p-5 font-semibold">Inverter</th>
                        <th className="p-5 font-semibold">Battery</th>
                        <th className="p-5 font-semibold">Rods</th>
                        <th className="p-5 font-semibold">Wiring</th>
                        <th className="p-5 font-semibold text-right">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookingsWithDocs.map((b) => {
                        const panelCount = parseInt(b.documents?.panel_count || b.documents?.panelCount || 1);
                        const rodCount   = parseInt(b.documents?.rod_count || 0);
                        const cost = PANEL_UNIT_COST * panelCount + INVERTER_COST + BATTERY_COST + ROD_UNIT_COST * rodCount + WIRE_COST;
                        return (
                          <tr key={b.id} className="hover:bg-white/5 transition">
                            <td className="p-5 font-bold text-gray-200">{b.client_name}</td>
                            <td className="p-5 text-gray-400 text-sm">{b.documents?.panel_type || 'N/A'} × {panelCount}</td>
                            <td className="p-5 text-gray-400 text-sm">{b.documents?.inverter_type || 'Standard'}</td>
                            <td className="p-5 text-gray-400 text-sm">{b.documents?.battery_type || 'Standard'}</td>
                            <td className="p-5 text-gray-400 text-sm">{rodCount} × {b.documents?.rod_type || 'GI'}</td>
                            <td className="p-5 text-gray-400 text-sm">{b.documents?.wire_type || 'Standard'}</td>
                            <td className="p-5 font-extrabold text-right text-orange-400">₹{cost.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      <tr className="bg-orange-500/5 border-t-2 border-orange-500/30">
                        <td colSpan={6} className="p-5 font-extrabold text-orange-300 uppercase tracking-widest text-sm">Grand Total — All Materials</td>
                        <td className="p-5 font-extrabold text-right text-2xl text-orange-400">₹{totalMaterialsCost.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* 🧾 INVOICE VIEW MODAL */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4 overflow-y-auto"
            onClick={() => setSelectedInvoice(null)}
          >
            <motion.div 
               initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
               className="bg-white text-[#0f172a] p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-4xl relative print:p-0 print:shadow-none print:rounded-none"
               onClick={e => e.stopPropagation()}
            >
                <div className="absolute top-6 right-6 flex gap-3 print:hidden">
                    <button onClick={() => window.print()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-full transition shadow-sm border border-gray-200">
                        <FileText className="w-5 h-5" />
                    </button>
                    <button onClick={() => setSelectedInvoice(null)} className="bg-red-50 hover:bg-red-100 text-red-500 p-3 rounded-full transition shadow-sm border border-red-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex justify-between items-start mb-12 border-b-2 border-gray-100 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-orange-500 rounded-lg">
                                <Building className="w-6 h-6 text-white" />
                             </div>
                             <h1 className="text-2xl font-black uppercase tracking-tighter">SOLAR<span className="text-orange-500">NODE</span></h1>
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Energy Infrastructure Group</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-black text-gray-200 uppercase mb-2">INVOICE</h2>
                        <div className="space-y-1">
                            <p className="text-sm font-bold"><span className="text-gray-400">Ledger ID:</span> {selectedInvoice.bill_no}</p>
                            <p className="text-sm font-bold"><span className="text-gray-400">Timestamp:</span> {selectedInvoice.date}</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Billing Information</h3>
                        <p className="text-xl font-bold text-[#0f172a] capitalize">{selectedInvoice.client_name}</p>
                        <p className="text-sm text-gray-500 mt-2">Active Solar Node Client</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Financial Status</h3>
                        <div className="flex justify-between items-center bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-green-500/20">
                            SETTLED <CheckCircle className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 text-center uppercase tracking-wider font-bold">Electronically Verified Transaction</p>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Hardware & Deployment Inventory</h3>
                    <div className="overflow-hidden border border-gray-100 rounded-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-[10px] uppercase font-black tracking-widest text-gray-500">
                                    <th className="p-4">Material Specification</th>
                                    <th className="p-4 text-center">Unit</th>
                                    <th className="p-4 text-right">Base Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {selectedInvoiceMaterials && Object.entries(selectedInvoiceMaterials).map(([key, data]) => {
                                    if (key === 'total') return null;
                                    return (
                                        <tr key={key} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4">
                                                <p className="font-bold text-gray-800 capitalize">{key}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{data.type}</p>
                                            </td>
                                            <td className="p-4 text-center text-gray-500 font-bold">{data.count || '1 Set'}</td>
                                            <td className="p-4 text-right font-black text-gray-800">₹{data.cost.toLocaleString()}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col items-end border-t-2 border-gray-100 pt-8 gap-3">
                    <div className="flex items-center gap-12 w-full md:w-80 justify-between text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Gross Material Cost</span>
                        <span className="font-bold text-gray-800">₹{selectedInvoiceMaterials?.total?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex items-center gap-12 w-full md:w-80 justify-between text-sm">
                        <span className="text-green-500 font-bold uppercase tracking-wider">Govt Subsidy (Applied)</span>
                        <span className="font-bold text-green-600">- ₹{(selectedInvoice.subsidy || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-12 w-full md:w-80 justify-between text-sm">
                        <span className="text-blue-500 font-bold uppercase tracking-wider">Bank Loan (Sanctioned)</span>
                        <span className="font-bold text-blue-600">- ₹{(selectedInvoice.loan || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-12 w-full md:w-80 justify-between text-xl bg-[#0f172a] text-white p-5 rounded-2xl mt-4 shadow-xl border-t-4 border-orange-500">
                        <span className="font-black uppercase tracking-tighter">Net Amount Paid</span>
                        <span className="font-black text-orange-400 flex items-center gap-1">
                             ₹{parseFloat(selectedInvoice.amount).toLocaleString()}
                        </span>
                    </div>
                </div>
                    <div className="flex items-center gap-12 w-full md:w-80 justify-between text-xl bg-[#0f172a] text-white p-5 rounded-2xl mt-4 shadow-xl">
                        <span className="font-black uppercase tracking-tighter">Total Paid</span>
                        <span className="font-black text-orange-400 flex items-center gap-1">
                             ₹{parseFloat(selectedInvoice.amount).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="mt-12 text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] relative">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-gray-100 -z-10"></div>
                    <span className="bg-white px-6">Official SolarNode Document</span>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Billing;
