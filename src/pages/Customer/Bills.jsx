import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, CheckCircle, Clock, Download } from "lucide-react";
import api from "../../api/axiosConfig";

function Bills() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = sessionStorage.getItem("solar_user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    Promise.all([
      api.get(`bills/?client_id=${user.id}`),
      api.get(`bookings/?client_id=${user.id}`)
    ])
      .then(([billRes, bookingRes]) => {
        const billsData = billRes.data;
        // Extract bookings with final invoices and convert to bill-like format
        const invoicesFromBookings = bookingRes.data
          .filter(b => b.documents?.final_invoice)
          .map(b => ({
            id: `invoice-${b.id}`,
            bill_no: `INV-${b.id}`,
            date: b.confirmed_date || b.created_at?.split('T')[0],
            units: 0,
            amount: b.estimated_cost || 0,
            status: "Paid",
            type: "invoice",
            booking_id: b.id,
            final_invoice: b.documents.final_invoice,
            address: b.address
          }));
        
        // Combine bills and invoices, sort by date descending
        const combined = [...billsData, ...invoicesFromBookings].sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA;
        });
        
        setBills(combined);
      })
      .catch(err => console.error("Fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredBills = bills.filter((bill) =>
    (bill.bill_no && bill.bill_no.toLowerCase().includes(search.toLowerCase())) ||
    (bill.address && bill.address.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPaid = bills.filter((b) => b.status === "Paid").reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const totalPending = bills.filter((b) => b.status === "Unpaid").reduce((sum, b) => sum + parseFloat(b.amount), 0);

  const handlePay = async (id) => {
    // In prod, this opens a Stripe modal or Payment.jsx. For our demo logic, we'll mark it paid directly via DB.
    try {
        await api.patch(`bills/${id}/`, { status: "Paid" });
        setBills(bills.map(b => b.id === id ? { ...b, status: "Paid" } : b));
    } catch (err) {
        alert("Failed to process transaction.");
    }
  };

  return (
    <div className="bg-[#020617] min-h-screen p-6 font-sans text-white overflow-x-hidden">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Finances & Invoices</h1>
          <p className="text-gray-400 mt-2 font-medium">
            Monitor your energy expenditures and hardware loans
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
                type="text"
                placeholder="Search index..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 bg-[#0f172a]/60 border border-white/10 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all shadow-inner text-white"
            />
        </motion.div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
            { tag: "Total Invoices", value: bills.length, icon: FileText, color: "text-gray-300" },
            { tag: "Cleared", value: bills.filter(b => b.status === "Paid").length, icon: CheckCircle, color: "text-green-400" },
            { tag: "Outstanding", value: bills.filter(b => b.status === "Unpaid").length, icon: Clock, color: "text-red-400" },
            { tag: "Gross Paid", value: `₹${totalPaid.toLocaleString()}`, color: "text-blue-400" }
        ].map((stat, i) => (
            <motion.div 
               key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
               className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex flex-col justify-between"
            >
               <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase mb-2">{stat.tag}</p>
               {loading ? <div className="h-8 w-16 bg-white/5 animate-pulse rounded"></div> : <h2 className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</h2>}
            </motion.div>
        ))}
      </div>

      {/* TABLE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
      >
        {loading ? (
            <div className="p-12 space-y-4 text-center text-gray-500 animate-pulse font-medium">Fetching transaction ledger...</div>
        ) : filteredBills.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-lg">No Financial Records 🔍</p>
            <p className="text-gray-600 mt-1">Your invoice history is empty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest">
                  <th className="p-5 font-semibold">Ledger ID</th>
                  <th className="p-5 font-semibold">Timestamp</th>
                  <th className="p-5 font-semibold">KWh Metric</th>
                  <th className="p-5 font-semibold">Total Amount</th>
                  <th className="p-5 font-semibold text-center">Status</th>
                  <th className="p-5 font-semibold text-center">Invoice</th>
                  <th className="p-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-white/5 transition group">
                    <td className="p-5 font-medium text-gray-200">{bill.bill_no}</td>
                    <td className="p-5 text-gray-500 tracking-wide text-sm">{bill.date}</td>
                    <td className="p-5 text-gray-300">{bill.units || "-"}</td>
                    <td className="p-5 font-semibold text-white">₹{parseFloat(bill.amount || 0).toLocaleString()}</td>
                    
                    <td className="p-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border ${
                          bill.status === "Paid"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {bill.status}
                      </span>
                    </td>

                    <td className="p-5 text-center">
                      {bill.type === "invoice" && bill.final_invoice ? (
                        <a 
                          href={bill.final_invoice} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition font-medium text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          View
                        </a>
                      ) : (
                        <span className="text-gray-600 text-sm">-</span>
                      )}
                    </td>

                    <td className="p-5 text-right">
                      {bill.type === "invoice" ? (
                        <a
                          href={bill.final_invoice}
                          download
                          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-4 py-2 rounded-xl transition shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      ) : bill.status === "Unpaid" ? (
                        <button
                          onClick={() => handlePay(bill.id)}
                          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-bold px-4 py-2 rounded-xl transition shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                        >
                          Execute
                        </button>
                      ) : (
                        <span className="text-gray-600 font-medium text-sm">Settled</span>
                      )}
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

export default Bills;
