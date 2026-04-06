import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, CheckCircle, Clock, Plus, X, Building } from "lucide-react";
import api from "../../api/axiosConfig";

function Billing() {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, []);

  const fetchBills = async () => {
    try {
        setLoading(true);
        const [billsRes, custRes] = await Promise.all([
            api.get('bills/'),
            api.get('users/?role=customer')
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
    } catch (err) {
        console.error("Failed to fetch billing data", err);
    } finally {
        setLoading(false);
    }
  };

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setBillForm(prev => ({ ...prev, [name]: value }));
  };

  const generateInvoice = async () => {
      if (!billForm.client || !billForm.bill_no || !billForm.amount) {
          alert("Client, Bill No, and Amount are strictly required.");
          return;
      }
      try {
          await api.post('bills/', billForm);
          setIsModalOpen(false);
          fetchBills();
      } catch (err) {
           console.error(err);
           alert("Invoice generation failed.");
      }
  };

  // 🔍 SEARCH
  const filteredBills = bills.filter((bill) =>
    (bill.bill_no?.toLowerCase().includes(search.toLowerCase())) ||
    (bill.client_name?.toLowerCase().includes(search.toLowerCase()))
  );

  // 💰 TOTAL PAID
  const totalPaid = bills.filter((b) => b.status === "Paid").reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
  const totalPending = bills.filter((b) => b.status === "Unpaid").reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

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
            
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl transition flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/25 shrink-0">
               <Plus className="w-5 h-5" /> Issue
            </button>
        </motion.div>
      </div>

      {/* MACRO SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
            { tag: "Outstanding Debt", value: `₹${totalPending.toLocaleString()}`, color: "text-red-400", sub: `${bills.filter(b => b.status === "Unpaid").length} active ledgers` },
            { tag: "Resolved Revenue", value: `₹${totalPaid.toLocaleString()}`, color: "text-green-400", sub: `${bills.filter(b => b.status === "Paid").length} settled ledgers` },
            { tag: "Network Invoices", value: bills.length, color: "text-white", sub: "Total volume generated" }
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
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-white/5 transition group cursor-pointer">
                    <td className="p-5 font-bold text-gray-200">{bill.bill_no}</td>
                    <td className="p-5 text-gray-400 font-medium">@{bill.client_name || 'unknown_node'}</td>
                    <td className="p-5 text-gray-500 text-sm tracking-wide">{bill.date || 'Syncing...'}</td>
                    <td className="p-5 text-gray-300">{bill.units} kW</td>
                    <td className="p-5 font-bold text-right text-white">₹{parseFloat(bill.amount).toLocaleString()}</td>
                    
                    <td className="p-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase border ${
                          bill.status === "Paid"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : bill.status?.includes("Slot")
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/10 text-red-500 border-red-500/30"
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Billing;
