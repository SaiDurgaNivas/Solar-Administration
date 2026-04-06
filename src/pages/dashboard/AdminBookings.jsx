import React, { useEffect, useState } from "react";
import { BookOpen, MapPin, Zap, Phone, AlertCircle, FileText, CheckCircle, ShieldAlert, UploadCloud } from "lucide-react";
import api from "../../api/axiosConfig";
import { motion } from "framer-motion";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceFiles, setInvoiceFiles] = useState({});
  const [activeTab, setActiveTab] = useState('new');

  const fetchBookings = async () => {
    try {
      const response = await api.get('bookings/');
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching pipeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const newRequests = bookings.filter((booking) => [
    'Awaiting Admin',
    'Forwarded'
  ].includes(booking.status));

  const displayedBookings = activeTab === 'new' ? newRequests : bookings;

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id, status) => {
    try {
        await api.patch(`bookings/${id}/`, { status });
        alert(`Status updated to: ${status}`);
        fetchBookings();
    } catch(err) {
        alert("Failed to update status.");
    }
  };

  const handleInvoiceUpload = async (bookingId) => {
    const file = invoiceFiles[bookingId];
    if(!file) { alert("Please select a PDF/Image for the invoice."); return; }
    
    // We must find the document ID for this booking. 
    // Since we created `bookingdocs`, we fetch them. But for simplicity, we can do it via API patch.
    // Wait, let's fetch the docs for this booking first:
    try {
        const docRes = await api.get(`bookingdocs/?booking_id=${bookingId}`);
        if(docRes.data.length > 0) {
            const docId = docRes.data[0].id;
            const formData = new FormData();
            formData.append('final_invoice', file);
            await api.patch(`bookingdocs/${docId}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            alert("Final Invoice Uploaded Successfully!");
        } else {
            alert("No documentation packet found for this booking.");
        }
    } catch(err) {
        alert("Failed to upload invoice.");
    }
  };

  if (loading) return <div className="text-white p-10">Loading Loan Pipeline...</div>;

  return (
    <div className="p-2 max-w-7xl mx-auto text-white">
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-yellow-400" /> Admin Approval & Loan Pipeline
          </h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-wider font-semibold">Verify configurations and manage incoming admin requests.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { key: 'new', label: 'New Requests', count: newRequests.length },
            { key: 'all', label: 'All Bookings', count: bookings.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.35)]' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {displayedBookings.length > 0 ? displayedBookings.map((b) => (
            <motion.div key={b.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between mb-6 pb-6 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-bold">{b.client_name}</h2>
                        <span className="text-sm text-gray-500 font-mono">BOOKING ID: #{b.id} | <Phone className="inline w-3 h-3 text-gray-400" /> {b.phone}</span>
                    </div>
                    <div>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border shadow-inner ${
                            b.status === 'Awaiting Admin' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                            b.status === 'Loan Approved' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                            b.status === 'Loan Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                            b.status === 'Direct Pay Confirmed' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                            b.status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/30'
                        }`}>
                            {b.status}
                        </span>
                    </div>
                </div>

                {b.documents && (
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                        <div>
                            <h3 className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Zap className="w-4 h-4"/> Hardware Specification</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm bg-[#020617] p-4 rounded-xl border border-white/5">
                                <p><span className="text-gray-500">Panel Type:</span> {b.documents.panel_type}</p>
                                <p><span className="text-gray-500">Capacity:</span> {b.documents.capacity}</p>
                                <p><span className="text-gray-500">Inverter:</span> {b.documents.inverter_type}</p>
                                <p><span className="text-gray-500">Battery:</span> {b.documents.battery_type}</p>
                                <p><span className="text-gray-500">Rods:</span> {b.documents.rod_count} ({b.documents.rod_type})</p>
                                <p><span className="text-gray-500">Wires:</span> {b.documents.wire_type}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/> Customer Documents</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm bg-[#020617] p-4 rounded-xl border border-white/5">
                                {['current_bill', 'aadhar_card', 'pan_card', 'bank_details', 'house_tax', 'bank_statement_6m'].map(k => (
                                    b.documents[k] ? <a key={k} href={b.documents[k]} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline capitalize flex items-center gap-1"><FileText className="w-3 h-3"/> {k.replace(/_/g, ' ')}</a> : <span key={k} className="text-gray-600 capitalize">{k.replace(/_/g, ' ')}: N/A</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Agent Action Area */}
                <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center justify-end">
                    {['Awaiting Admin', 'Forwarded'].includes(b.status) && (
                        <>
                            <button onClick={() => updateBookingStatus(b.id, 'Loan Rejected')} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white px-5 py-2.5 rounded-xl font-bold transition">
                                <ShieldAlert className="w-5 h-5"/> Reject Loan (Request Direct Pay)
                            </button>
                            <button onClick={() => updateBookingStatus(b.id, 'Loan Approved')} className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-6 py-2.5 rounded-xl font-bold transition shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]">
                                <CheckCircle className="w-5 h-5"/> Loan Approved & Verified
                            </button>
                        </>
                    )}
                    {b.status === 'Loan Rejected' && (
                        <button onClick={() => updateBookingStatus(b.id, 'Direct Pay Confirmed')} className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500 border border-purple-500/30 text-purple-400 hover:text-white px-5 py-2.5 rounded-xl font-bold transition">
                            <CheckCircle className="w-5 h-5"/> Confirm Direct Pay
                        </button>
                    )}
                    {b.status === "Completed" && (
                        <div className="w-full flex justify-between items-center bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl mt-4">
                            <div>
                                <h3 className="font-bold text-blue-400 text-lg">Upload Final Invoice</h3>
                                <p className="text-xs text-gray-500">Provide the final hardware bill for the customer to download.</p>
                            </div>
                            <div className="flex gap-2">
                                <input type="file" className="text-sm bg-[#020617] border border-white/10 p-2 rounded-lg outline-none file:mr-2 file:bg-blue-500/10 file:border-0 file:rounded file:text-blue-400" onChange={e => setInvoiceFiles({...invoiceFiles, [b.id]: e.target.files[0]})} />
                                <button onClick={() => handleInvoiceUpload(b.id)} className="bg-blue-500 hover:bg-blue-400 text-white font-bold p-2 px-4 rounded-lg flex items-center gap-2">
                                    <UploadCloud className="w-4 h-4"/> Submit
                                </button>
                            </div>
                        </div>
                    )}
                    {b.documents?.final_invoice && (
                        <div className="w-full mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center gap-2 font-bold justify-center">
                            <FileText className="w-5 h-5" /> Final Invoice Successfully Attached! 
                        </div>
                    )}
                </div>
            </motion.div>
        )) : (
            <div className="text-center py-20 border border-white/5 rounded-3xl bg-[#0f172a]/30">
                <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">{activeTab === 'new' ? 'No New Admin Requests' : 'No Bookings Found'}</h3>
                <p className="text-gray-600 mt-2">{activeTab === 'new' ? 'There are currently no appointment requests pending admin review.' : 'No booking records are available at this time.'}</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
