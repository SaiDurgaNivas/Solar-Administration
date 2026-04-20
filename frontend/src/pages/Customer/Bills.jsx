import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, CheckCircle, Clock, Download, CreditCard, Smartphone, Landmark, ScanLine, X, ShieldCheck, Building } from "lucide-react";
import api from "../../api/axiosConfig";

function Bills() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Authenticated User Scope
  const userStr = sessionStorage.getItem("solar_user");
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Payment Modal State
  const [paymentModal, setPaymentModal] = useState({ open: false, bill: null, step: 1, method: 'upi', successData: null, selectedSlot: 'full' });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedInvoiceMaterials, setSelectedInvoiceMaterials] = useState(null);
  
  // Cost Constants
  const PANEL_UNIT_COST = 17000; 
  const INVERTER_COST = 25000;
  const BATTERY_COST = 15000;
  const ROD_UNIT_COST = 1200;
  const WIRE_COST = 850;

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (showLoader = true) => {
    if (!user) return;

    try {
      if (showLoader) setLoading(true);
      const [billRes, bookingRes] = await Promise.all([
        api.get(`bills/?client_id=${user.id}`),
        api.get(`bookings/?client_id=${user.id}`)
      ]);

      const billsData = billRes.data;
      const invoicesFromBookings = bookingRes.data
        .filter(b => b.documents?.final_invoice || b.status === 'Loan Approved' || b.status === 'Sanctioned')
        .map(b => ({
          id: `inv-${b.id}`,
          bill_no: `INV-${b.id}`,
          date: b.confirmed_date || b.created_at?.split('T')[0],
          units: 0,
          amount: b.estimated_cost || 0,
          status: "Paid",
          type: "invoice",
          final_invoice: b.documents?.final_invoice,
          address: b.address
        }));
      
      let combined = [...billsData, ...invoicesFromBookings].sort((a, b) => 
        new Date(b.date || 0) - new Date(a.date || 0)
      );
      
      if (combined.length === 0) {
          combined.push({
              id: 'demo-bill-1',
              bill_no: 'DEMO-INV-001',
              date: new Date().toISOString().split('T')[0],
              units: 0,
              amount: 158000,
              status: localStorage.getItem('demo_bill_status') || 'Unpaid',
              type: 'installation'
          });
      }
      
      setBills(combined);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const filteredBills = bills.filter((bill) =>
    (bill.bill_no?.toLowerCase().includes(search.toLowerCase())) ||
    (bill.address?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPaid = bills.filter((b) => b.status === "Paid" || b.status?.includes("Slot")).reduce((sum, b) => sum + parseFloat(b.amount), 0); // Note: Simple sum for now
  const totalPending = bills.filter((b) => b.status !== "Paid" && b.type !== "invoice").reduce((sum, b) => sum + parseFloat(b.amount), 0);

  const openPaymentGate = (bill) => {
      setPaymentModal({ open: true, bill, step: 1, method: 'upi', successData: null, selectedSlot: 'full' });
  };

  const executePayment = async () => {
      const { bill } = paymentModal;
      setPaymentModal(prev => ({ ...prev, step: 2 })); // Processing state
      
      setTimeout(async () => {
          try {
              let newStatus = "Paid";
              if (paymentModal.selectedSlot === 'slot1') newStatus = "Slot 1 Paid";
              else if (paymentModal.selectedSlot === 'slot2') newStatus = "Slot 2 Paid";
              else if (paymentModal.selectedSlot === 'slot3' || paymentModal.selectedSlot === 'full') newStatus = "Paid";

              if (bill.id !== 'demo-bill-1') {
                  await api.patch(`bills/${bill.id}/`, { status: newStatus });
              } else {
                  // Save dummy bill state for Admin Dashboard sync
                  localStorage.setItem('demo_bill_status', newStatus);
              }
              setBills(bills.map(b => b.id === bill.id ? { ...b, status: newStatus } : b));
              setPaymentModal(prev => ({ 
                  ...prev, 
                  step: 3, 
                  newStatusValue: newStatus,
                  successData: { date: new Date().toLocaleString(), transactionId: 'TXN' + Math.floor(Math.random()*1000000000) } 
              }));
          } catch (err) {
              console.error(err);
              alert("Failed to process transaction network.");
              setPaymentModal(prev => ({ ...prev, step: 1 }));
          }
      }, 1500);
  };

  const openInvoice = async (bill) => {
    try {
        const bookingsRes = await api.get('bookings/');
        const allBookings = bookingsRes.data;
        const matchingBooking = allBookings.find(b => 
            b.client === bill.client || 
            (b.client_name?.toLowerCase() === bill.client_name?.toLowerCase())
        );

        if (matchingBooking && matchingBooking.documents) {
            const docs = matchingBooking.documents;
            const panelCount = parseInt(docs.panel_count || docs.panelCount || 1);
            const rodCount = parseInt(docs.rod_count || 0);
            const materialTotal = PANEL_UNIT_COST * panelCount + INVERTER_COST + BATTERY_COST + ROD_UNIT_COST * rodCount + WIRE_COST;

            setSelectedInvoiceMaterials({
                panels: { type: docs.panel_type || 'Monocrystalline', count: panelCount, cost: PANEL_UNIT_COST * panelCount },
                inverter: { type: docs.inverter_type || 'Standard Hybrid', cost: INVERTER_COST },
                battery: { type: docs.battery_type || 'Lithium-Ion 6kWh', cost: BATTERY_COST },
                rods: { type: docs.rod_type || 'Earth GI', count: rodCount, cost: ROD_UNIT_COST * rodCount },
                wiring: { type: docs.wire_type || 'Heavy Duty DC', cost: WIRE_COST },
                total: materialTotal
            });
        } else {
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
    } catch (err) {
        console.error("Failed to fetch material details for invoice", err);
        alert("Could not load invoice data.");
    }
  };

  return (
    <div className="bg-[#020617] min-h-screen p-6 font-sans text-white overflow-x-hidden">

      {/* PAYMENT MODAL */}
      {paymentModal.open && paymentModal.bill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f172a] border border-white/10 p-0 rounded-3xl max-w-3xl w-full relative shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row">
                
                {paymentModal.step !== 3 && (
                    <button onClick={() => setPaymentModal({ open: false })} className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/20 hover:bg-black/40 p-2 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* LEFT: Bill Summary */}
                <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-r border-white/10 p-8 w-full md:w-2/5 text-white flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold mb-1">Checkout</h2>
                        <p className="text-xs text-orange-400 font-bold uppercase tracking-widest mb-8">Secure Payment Gateway</p>
                        
                        {paymentModal.bill && (
                            <div className="space-y-4 text-sm font-medium mb-8">
                                <div className="flex justify-between border-b border-white/10 pb-3">
                                    <span className="opacity-70">Gross System Cost</span>
                                    <span>₹{(parseFloat(paymentModal.bill.amount) + 78000 + 40000).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-3 text-green-400">
                                    <span>Govt Subsidy Applied</span>
                                    <span>- ₹78,000</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-3 text-orange-400">
                                    <span>Financed Loan</span>
                                    <span>- ₹40,000</span>
                                </div>
                                <div className="flex justify-between pt-3 text-xl font-extrabold text-white">
                                    <span>Total Payable</span>
                                    <span>₹{parseFloat(paymentModal.bill.amount).toLocaleString()}</span>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">Installment Breakdown</h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between text-gray-300">
                                            <span className={paymentModal.bill.status === "Unpaid" ? "" : "line-through opacity-40 text-green-500"}>Slot 1: Advance Booking</span>
                                            <span className={paymentModal.bill.status === "Unpaid" ? "" : "line-through opacity-40"}>₹{(parseFloat(paymentModal.bill.amount) * 0.33).toFixed(0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-300">
                                            <span className={["Unpaid", "Slot 1 Paid"].includes(paymentModal.bill.status) ? "" : "line-through opacity-40 text-green-500"}>Slot 2: Hardware Delivery</span>
                                            <span className={["Unpaid", "Slot 1 Paid"].includes(paymentModal.bill.status) ? "" : "line-through opacity-40"}>₹{(parseFloat(paymentModal.bill.amount) * 0.33).toFixed(0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-300">
                                            <span className={["Unpaid", "Slot 1 Paid", "Slot 2 Paid"].includes(paymentModal.bill.status) ? "" : "line-through opacity-40 text-green-500"}>Slot 3: Post-Installation</span>
                                            <span className={["Unpaid", "Slot 1 Paid", "Slot 2 Paid"].includes(paymentModal.bill.status) ? "" : "line-through opacity-40"}>₹{(parseFloat(paymentModal.bill.amount) * 0.34).toFixed(0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-50 text-xs font-bold uppercase tracking-widest text-green-400">
                        <ShieldCheck className="w-4 h-4" /> 256-bit SSL Encrypted
                    </div>
                </div>

                {/* RIGHT: Payment Options & Forms */}
                <div className="p-8 w-full md:w-3/5 bg-[#020617] relative">
                    {paymentModal.step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="text-white font-bold mb-4 text-sm tracking-wide">Select Payment Method</h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[
                                    { id: 'upi', icon: Smartphone, label: 'UPI / VPA' },
                                    { id: 'qr', icon: ScanLine, label: 'QR Code' },
                                    { id: 'card', icon: CreditCard, label: 'Cards' },
                                    { id: 'netbank', icon: Landmark, label: 'Net Banking' }
                                ].map(method => (
                                    <button 
                                        key={method.id} 
                                        onClick={() => setPaymentModal({...paymentModal, method: method.id})}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition ${paymentModal.method === method.id ? 'bg-orange-500/10 border-orange-500 text-orange-400' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        <method.icon className="w-6 h-6 mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{method.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Input Form */}
                            <div className="mb-8 min-h-[120px]">
                                {paymentModal.method === 'upi' && <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" className="w-full bg-[#0f172a] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition text-sm" />}
                                {paymentModal.method === 'qr' && <div className="p-4 bg-white rounded-xl flex justify-center w-32 mx-auto"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=payUPI_Solar" alt="QR" className="w-full h-full" /></div>}
                                {paymentModal.method === 'card' && (
                                    <div className="space-y-3">
                                        <input type="text" placeholder="Card Number" className="w-full bg-[#0f172a] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition text-sm" />
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="MM/YY" className="w-1/2 bg-[#0f172a] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition text-sm" />
                                            <input type="text" placeholder="CVV" className="w-1/2 bg-[#0f172a] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition text-sm" />
                                        </div>
                                    </div>
                                )}
                                {paymentModal.method === 'netbank' && (
                                    <select className="w-full bg-[#0f172a] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition text-sm appearance-none">
                                        <option>SBI - State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option>
                                    </select>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Select Payment To Execute</label>
                                <select 
                                    className="w-full bg-[#0f172a] border border-white/20 p-3 rounded-xl text-white outline-none focus:border-orange-500 transition text-sm appearance-none"
                                    value={paymentModal.selectedSlot}
                                    onChange={(e) => setPaymentModal({...paymentModal, selectedSlot: e.target.value})}
                                >
                                    {paymentModal.bill.status === "Unpaid" && (
                                        <>
                                            <option value="full">Pay Full Amount (₹{parseFloat(paymentModal.bill.amount).toLocaleString()})</option>
                                            <option value="slot1">Slot 1: Advance Booking (₹{(parseFloat(paymentModal.bill.amount)*0.33).toFixed(0)})</option>
                                        </>
                                    )}
                                    {paymentModal.bill.status === "Slot 1 Paid" && (
                                        <>
                                            <option value="slot2">Slot 2: Hardware Delivery (₹{(parseFloat(paymentModal.bill.amount)*0.33).toFixed(0)})</option>
                                            <option value="full">Pay All Remaining (Slot 2 & 3)</option>
                                        </>
                                    )}
                                    {paymentModal.bill.status === "Slot 2 Paid" && (
                                        <option value="slot3">Slot 3: Final Payment (₹{(parseFloat(paymentModal.bill.amount)*0.34).toFixed(0)})</option>
                                    )}
                                </select>
                            </div>

                            <button onClick={executePayment} className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-extrabold py-4 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition uppercase tracking-widest text-sm">
                                Pay Now
                            </button>
                        </motion.div>
                    )}

                    {paymentModal.step === 2 && (
                        <div className="flex flex-col items-center justify-center h-full py-20 pb-32">
                            <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                            <p className="text-orange-400 font-bold tracking-widest uppercase text-sm animate-pulse">Contacting Banking Partner...</p>
                        </div>
                    )}

                    {paymentModal.step === 3 && (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center h-full py-6 text-center pb-10">
                            <CheckCircle className="w-20 h-20 text-green-500 mb-4 shadow-[0_0_30px_rgba(34,197,94,0.4)] rounded-full bg-green-500/10" />
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                            {paymentModal.newStatusValue === "Paid" ? (
                                <p className="text-green-400 font-bold text-xs mb-8 uppercase tracking-widest">Admin Team has been notified. Invoice will be generated soon.</p>
                            ) : (
                                <p className="text-yellow-400 font-bold text-xs mb-8 uppercase tracking-widest">Installment Paid. Remaining slots must be cleared.</p>
                            )}
                            
                            <div className="bg-white/5 border border-white/10 p-5 rounded-xl w-full text-left mb-8 text-sm">
                                <div className="flex justify-between mb-3"><span className="text-gray-500">Transaction ID:</span> <span className="font-mono font-bold text-gray-300">{paymentModal.successData?.transactionId}</span></div>
                                <div className="flex justify-between mb-3"><span className="text-gray-500">Date & Time:</span> <span className="text-gray-300 font-medium">{paymentModal.successData?.date}</span></div>
                                <div className="flex justify-between border-t border-white/5 pt-3"><span className="text-gray-400 font-bold">Amount Settled:</span> <span className="font-bold text-green-400">₹{parseFloat(paymentModal.bill.amount).toLocaleString()}</span></div>
                            </div>
                            
                            <button onClick={() => setPaymentModal({ open: false })} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white w-full py-3.5 rounded-xl font-bold transition text-sm uppercase tracking-widest">
                                Return to Invoices
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
      )}

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

      {/* SUMMARY CARDS & COST DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { tag: "Total Invoices", value: bills.length, icon: FileText, color: "text-gray-300" },
              { tag: "Cleared", value: bills.filter(b => b.status === "Paid").length, icon: CheckCircle, color: "text-green-400" },
              { tag: "Outstanding", value: bills.filter(b => b.status !== "Paid").length, icon: Clock, color: "text-red-400" },
              { tag: "Gross Paid", value: `₹${totalPaid.toLocaleString()}`, color: "text-blue-400" }
          ].map((stat, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-xl flex flex-col justify-between"
              >
                <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-2">{stat.tag}</p>
                {loading ? <div className="h-8 w-16 bg-white/5 animate-pulse rounded"></div> : <h2 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h2>}
              </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
           className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-6 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <Landmark className="w-20 h-20 text-white" />
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
             <ShieldCheck className="w-4 h-4" /> Cost Distribution
           </h3>
           <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400">Solar Grid System</span>
                <span className="text-white">₹2,76,000</span>
             </div>
             <div className="flex justify-between text-xs font-bold text-green-400">
                <span>Govt Subsidy (PM-Surya)</span>
                <span>- ₹78,000</span>
             </div>
             <div className="flex justify-between text-xs font-bold text-orange-400">
                <span>Bank Loan Sanctioned</span>
                <span>- ₹40,000</span>
             </div>
             <div className="border-t border-white/10 pt-3 flex justify-between text-base font-black text-white">
                <span>Net Payable</span>
                <span>₹1,58,000</span>
             </div>
           </div>
        </motion.div>
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
                    <td className="p-5 font-bold text-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-orange-400 opacity-60" />
                        {bill.bill_no}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-gray-300 text-sm font-medium">{bill.date}</span>
                        {bill.status === "Paid" && bill.paid_at && (
                          <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">
                            Cleared @ {new Date(bill.paid_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-gray-400 text-sm font-mono">{bill.units ? `${bill.units} kWh` : "-"}</td>
                    <td className="p-5 font-extrabold text-white text-lg">₹{parseFloat(bill.amount || 0).toLocaleString()}</td>
                    
                    <td className="p-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                          bill.status === "Paid"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : bill.status?.includes("Slot")
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {bill.status}
                      </span>
                    </td>

                    <td className="p-5 text-center">
                      {bill.status === "Paid" ? (
                        <button 
                          onClick={() => openInvoice(bill)}
                          className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg border border-blue-500/20 transition font-bold text-[10px] uppercase"
                        >
                          <ScanLine className="w-4 h-4" />
                          View Invoice
                        </button>
                      ) : bill.final_invoice && bill.final_invoice !== '#pending' ? (
                        <a 
                          href={bill.final_invoice} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg border border-blue-500/20 transition font-bold text-[10px] uppercase"
                        >
                          <ScanLine className="w-4 h-4" />
                          Old View
                        </a>
                      ) : (
                        <span className="text-gray-600 text-[10px] font-black uppercase tracking-tighter">Drafting...</span>
                      )}
                    </td>

                    <td className="p-5 text-right">
                      {bill.type === "invoice" ? (
                        <a
                          href={bill.final_invoice}
                          download
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-4 py-2 rounded-xl transition shadow-lg shadow-blue-500/20 text-xs uppercase tracking-wider"
                        >
                          <Download className="w-4 h-4" />
                          Save PDF
                        </a>
                      ) : (bill.status === "Unpaid" || bill.status === "Slot 1 Paid" || bill.status === "Slot 2 Paid") ? (
                        <button
                          onClick={() => openPaymentGate(bill)}
                          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-black px-4 py-2 rounded-xl transition shadow-lg shadow-orange-500/20 text-xs uppercase tracking-wider"
                        >
                          {bill.status === "Unpaid" ? "Pay Now" : "Next Slot"}
                        </button>
                      ) : (
                        <div className="flex flex-col items-end">
                           <span className="text-green-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                             <ShieldCheck className="w-3 h-3" /> Settled
                           </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      
      {/* 🧾 PREMIUM INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-[100] p-4 overflow-y-auto" onClick={() => setSelectedInvoice(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white text-[#0f172a] p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-4xl relative print:p-0" onClick={e => e.stopPropagation()}>
                <div className="absolute top-6 right-6 flex gap-3 print:hidden">
                    <button onClick={() => window.print()} className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition"><Download className="w-5 h-5" /></button>
                    <button onClick={() => setSelectedInvoice(null)} className="bg-red-50 p-3 rounded-full hover:bg-red-100 transition"><X className="w-5 h-5 text-red-500" /></button>
                </div>

                <div className="flex justify-between items-start mb-12 border-b-2 border-gray-100 pb-8">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">SOLAR<span className="text-orange-500">NODE</span></h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Premium Infrastructure Group</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-black text-gray-200">INVOICE</h2>
                        <p className="text-xs font-bold text-gray-400">{selectedInvoice.bill_no}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer Details</h3>
                        <p className="text-xl font-black capitalize text-gray-800">{user?.username}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-green-600 font-black text-sm uppercase tracking-widest flex items-center gap-2">
                             <CheckCircle className="w-5 h-5" /> Verified Settlemet
                        </span>
                        <p className="text-[10px] text-gray-400 font-bold mt-2">Digital Signature Confirmed</p>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Hardware & Installation Inventory</h3>
                    <div className="overflow-hidden border border-gray-100 rounded-2xl">
                        <table className="w-full text-left">
                           <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase">
                              <tr><th className="p-4 leading-none">Material Specification</th><th className="p-4 text-center">Unit</th><th className="p-4 text-right">Cost</th></tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 text-sm">
                              {selectedInvoiceMaterials && Object.entries(selectedInvoiceMaterials).map(([key, data]) => {
                                  if (key === 'total') return null;
                                  return (
                                     <tr key={key}>
                                        <td className="p-4 font-bold text-gray-700 capitalize">{key}<br/><span className="text-[10px] text-gray-400 font-medium">{data.type}</span></td>
                                        <td className="p-4 text-center font-bold text-gray-500">{data.count || '1 Set'}</td>
                                        <td className="p-4 text-right font-black text-gray-800">₹{data.cost.toLocaleString()}</td>
                                     </tr>
                                  );
                              })}
                           </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col items-end border-t-2 border-gray-100 pt-8 gap-4">
                    <div className="flex justify-between w-full md:w-80 text-sm"><span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span><span className="font-bold text-gray-800">₹{selectedInvoiceMaterials?.total?.toLocaleString()}</span></div>
                    <div className="flex justify-between w-full md:w-80 text-sm text-green-600">
                        <span className="font-bold uppercase tracking-widest flex items-center gap-2">
                            Subsidy (Applied)
                            {selectedInvoice.status === "Paid" && <span className="text-[9px] bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">AUTOMATICALLY RELEASED</span>}
                        </span>
                        <span className="font-bold">- ₹{(selectedInvoice.subsidy || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between w-full md:w-80 text-sm text-blue-600"><span className="font-bold uppercase tracking-widest">Loan (Sanctioned)</span><span className="font-bold">- ₹{(selectedInvoice.loan || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between items-center w-full md:w-80 p-5 rounded-2xl bg-[#0f172a] text-white shadow-xl mt-4 border-t-4 border-orange-500">
                        <span className="font-black uppercase tracking-tighter">Amount Paid</span>
                        <span className="text-2xl font-black text-orange-400">₹{parseFloat(selectedInvoice.amount).toLocaleString()}</span>
                    </div>
                </div>

                <div className="mt-12 text-center text-[9px] text-gray-300 font-black uppercase tracking-[0.3em] border-t border-gray-50 pt-6">Official SolarNode Digital Receipt</div>
            </motion.div>
        </div>
      )}
    </div>
  );
}

export default Bills;
