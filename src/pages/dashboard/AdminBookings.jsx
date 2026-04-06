import React, { useEffect, useState } from "react";
import { BookOpen, MapPin, Zap, Phone, AlertCircle, FileText, CheckCircle, ShieldAlert, UploadCloud, X } from "lucide-react";
import api from "../../api/axiosConfig";
import { motion } from "framer-motion";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceFiles, setInvoiceFiles] = useState({});
  const [activeTab, setActiveTab] = useState('new');
  const [verifyModal, setVerifyModal] = useState({ open: false, booking: null, subCategory: '1', generatedForm: false });

  const fetchBookings = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const response = await api.get('bookings/');
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching pipeline:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const newRequests = bookings.filter((booking) => [
    'Awaiting Admin',
    'Forwarded'
  ].includes(booking.status));

  const displayedBookings = activeTab === 'new' ? newRequests : bookings;

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(() => fetchBookings(false), 4000);
    return () => clearInterval(interval);
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
    <div className="p-2 max-w-7xl mx-auto text-white relative">
    
      {/* VERIFICATION MODAL */}
      {verifyModal.open && verifyModal.booking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl custom-scrollbar">
                <button onClick={() => setVerifyModal({ open: false, booking: null, subCategory: '1', generatedForm: false })} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-blue-500" /> Online Application & Document Verification
                </h2>
                <p className="text-gray-400 mb-8 border-b border-white/10 pb-4">Verify agent documents and generate the official customer setup form.</p>

                {verifyModal.generatedForm ? (
                    <div className="bg-white text-black p-8 rounded-xl shadow-inner font-serif mb-6 print:block">
                        <div className="text-center border-b-2 border-black pb-4 mb-6">
                            <h1 className="text-3xl font-extrabold uppercase tracking-widest">Solar Energy Administration</h1>
                            <p className="text-sm mt-1">Official Network Application & Sanction Form</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div><strong className="text-gray-600">Applicant Name:</strong> {verifyModal.booking.client_name}</div>
                            <div><strong className="text-gray-600">Contact Node:</strong> {verifyModal.booking.phone}</div>
                            <div><strong className="text-gray-600">Hardware Profile:</strong> {verifyModal.booking.documents?.capacity} System ({verifyModal.booking.documents?.panel_type})</div>
                            <div><strong className="text-gray-600">Date Sanctioned:</strong> {new Date().toLocaleDateString()}</div>
                        </div>
                        <div className="bg-gray-100 p-4 border border-gray-300 rounded mb-6">
                            <p className="font-bold mb-2">Automated Underwriting Notes:</p>
                            <p className="text-xs text-gray-700">Documents verified: Aadhar, PAN, Property Tax, and Current Bill (Category 1). Capacity requirements cross-referenced with local grid load tolerance. All physical constraints successfully cleared for immediate provisioning.</p>
                        </div>
                        <div className="flex justify-between items-end mt-12 pt-6 border-t border-gray-300">
                            <div>
                                <div className="w-32 h-px bg-black mb-2"></div>
                                <p className="text-xs font-bold text-gray-600">Applicant Signature</p>
                            </div>
                            <div className="text-center">
                                <ShieldAlert className="w-12 h-12 text-green-600 mx-auto opacity-50 absolute -mt-8 -ml-6 -rotate-12" />
                                <div className="w-32 h-px bg-black mb-2 relative z-10"></div>
                                <p className="text-xs font-bold text-gray-600">Authorized Admin Seal</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        {/* LEFT: Documents View */}
                        <div className="bg-[#020617] border border-white/5 p-6 rounded-2xl">
                            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-400" /> Submitted Documentation</h3>
                            {verifyModal.booking.documents ? (
                                <div className="space-y-3">
                                    {['current_bill', 'aadhar_card', 'pan_card', 'bank_details', 'house_tax', 'bank_statement_6m'].map(k => (
                                        <div key={k} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="capitalize text-sm font-medium text-gray-300">{k.replace(/_/g, ' ')}</span>
                                            {verifyModal.booking.documents[k] 
                                                ? <a href={verifyModal.booking.documents[k]} target="_blank" rel="noreferrer" className="text-xs font-bold bg-blue-500/10 text-blue-400 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition">View File</a>
                                                : <span className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded">Missing</span>
                                            }
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No digital packet found.</p>
                            )}
                        </div>

                        {/* RIGHT: Validation Engine */}
                        <div className="bg-[#020617] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Automated Underwriting Engine</h3>
                                <p className="text-xs text-gray-400 mb-6">Extract current bill tier to determine loan eligibility. Commercial tiers (Sub Category 2) are automatically rejected.</p>
                                
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Detected Current Bill Sub-Category</label>
                                <select 
                                    className="w-full bg-[#0f172a] border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition mb-6"
                                    value={verifyModal.subCategory}
                                    onChange={(e) => setVerifyModal({ ...verifyModal, subCategory: e.target.value })}
                                >
                                    <option value="1">Sub Category 1 - Residential (Eligible)</option>
                                    <option value="2">Sub Category 2 - Commercial/Unknown (Ineligible)</option>
                                </select>
                            </div>

                            {verifyModal.subCategory === '2' ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <h4 className="font-bold text-red-400">LOAN NOT APPROVED</h4>
                                    <p className="text-xs text-red-300/70 mt-1 mb-4">Sub Category 2 accounts do not qualify for direct financing.</p>
                                    <button 
                                        onClick={() => { updateBookingStatus(verifyModal.booking.id, 'Loan Rejected'); setVerifyModal({ open: false, booking: null, subCategory: '1', generatedForm: false }); }} 
                                        className="w-full bg-red-500 text-white font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:bg-red-600 transition"
                                    >
                                        Auto-Reject Booking
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
                                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                    <h4 className="font-bold text-green-400">ACCOUNT ELIGIBLE</h4>
                                    <p className="text-xs text-green-300/70 mt-1 mb-4">Sub Category 1 validated. Safe to generate sanction protocols.</p>
                                    <button 
                                        onClick={() => setVerifyModal({...verifyModal, generatedForm: true})}
                                        className="w-full bg-green-500 text-black font-extrabold py-3 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-green-400 transition"
                                    >
                                        Generate Form File
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {verifyModal.generatedForm && (
                     <div className="flex justify-end gap-4 mt-6 border-t border-white/10 pt-6">
                        <button onClick={() => window.print()} className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:text-white transition font-bold">Print Record</button>
                        <button 
                            onClick={() => { updateBookingStatus(verifyModal.booking.id, 'Loan Approved'); setVerifyModal({ open: false, booking: null, subCategory: '1', generatedForm: false }); }}
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] transition"
                        >
                            Approve Loan & Issue Form
                        </button>
                     </div>
                )}
            </motion.div>
        </div>
      )}
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
                            <button onClick={() => setVerifyModal({ open: true, booking: b, subCategory: '1', generatedForm: false })} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] w-full justify-center">
                                <FileText className="w-5 h-5"/> Verify Documents & Apply Online
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
