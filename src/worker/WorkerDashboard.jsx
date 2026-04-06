import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HardHat, MapPin, CheckCircle, Activity, Power, CalendarCheck, Flag, FileText, User as UserIcon } from 'lucide-react';
import api from '../api/axiosConfig';

function WorkerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [vacationNote, setVacationNote] = useState('');
  const [vacationRequested, setVacationRequested] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [updatePhoto, setUpdatePhoto] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const user = JSON.parse(sessionStorage.getItem('solar_user')) || {};
  const assignedCount = tasks.filter((task) => ['Dispatched', 'In Progress'].includes(task.status)).length;

  const today = new Date().toISOString().slice(0, 10);

  const fetchTasks = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`teamtasks/?sub_worker=${user.id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchAttendance = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`attendance/?worker_id=${user.id}`);
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAttendance();
  }, [user?.id]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    try {
      await api.patch(`teamtasks/${taskId}/`, { status: newStatus });
      if (newStatus === 'Completed' && task?.booking_details?.id) {
        await api.patch(`bookings/${task.booking_details.id}/`, { status: 'Completed' });
      }
      fetchTasks();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const postAttendance = async (status) => {
    if (!user?.id) return;
    try {
      await api.post('attendance/', { worker: user.id, status });
      await fetchAttendance();
      alert(`Attendance marked as ${status}.`);
    } catch (err) {
      alert('Failed to update attendance.');
    }
  };

  const requestVacation = async () => {
    if (!vacationNote.trim()) {
      alert('Please describe your vacation request.');
      return;
    }

    try {
      await api.post('attendance/', { worker: user.id, status: 'On Leave' });
      setVacationRequested(true);
      setVacationNote('');
      await fetchAttendance();
      alert('Vacation request submitted.');
    } catch (err) {
      alert('Failed to submit vacation request.');
    }
  };

  const submitUpdate = async (taskId) => {
    if (!updateText || !updatePhoto) {
      alert('Please provide both a description and a photo.');
      return;
    }
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('task', taskId);
    formData.append('description', updateText);
    formData.append('photo', updatePhoto);

    try {
      await api.post('workerupdates/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUpdateText('');
      setUpdatePhoto(null);
      alert('Update uploaded successfully!');
      fetchTasks();
    } catch (err) {
      alert('Failed to post update.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('solar_user');
    window.location.href = '/';
  };

  const statusColor = (status) => {
    if (status === 'Completed') return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (status === 'In Progress') return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    if (status === 'On Leave') return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const todayRecord = attendance.find((record) => record.date === today);
  const attendanceStatus = todayRecord ? todayRecord.status : 'Not marked';

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans p-6 pb-24 border-t-4 border-orange-500">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center gap-2">
            <HardHat className="w-8 h-8 text-orange-500" /> Field Worker Dashboard
          </h1>
          <p className="text-gray-400 text-sm font-medium">Welcome back, {user.first_name || user.username}. Assigned work appears here after your agent dispatches it.</p>
          <p className="text-gray-500 text-sm mt-2">Active assignments: <span className="font-semibold text-white">{assignedCount}</span></p>
        </div>
        <button onClick={handleLogout} className="p-3 bg-white/5 hover:bg-red-500/10 text-red-500 rounded-full transition border border-white/5 flex items-center gap-2">
          <Power className="w-5 h-5" /> Logout
        </button>
      </div>

      <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'tasks', label: 'Assigned Work', icon: FileText },
            { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { key: 'vacation', label: 'Vacation', icon: Flag },
            { key: 'profile', label: 'Profile', icon: UserIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-start gap-2 p-4 rounded-3xl border transition ${activeTab === tab.key ? 'bg-orange-500/10 border-orange-500/30 text-orange-300' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'profile' && (
        <div id="profile" className="grid xl:grid-cols-[1.4fr_1fr] gap-6 mb-8">
          <div className="bg-[#0f172a] p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Your Profile</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex justify-between gap-4"><span className="text-gray-500">Name</span><span>{user.first_name || user.username || 'Worker'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-gray-500">Email</span><span>{user.email || 'Not set'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-gray-500">Role</span><span>{user.role === 'sub_worker' ? 'Field Worker' : user.role}</span></div>
              <div className="flex justify-between gap-4"><span className="text-gray-500">Joined</span><span>{user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</span></div>
            </div>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Quick Summary</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-2">Today's Attendance</p>
                <p className="font-semibold">{attendanceStatus}</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-2">Active Tasks</p>
                <p className="font-semibold">{tasks.filter((task) => task.status !== 'Completed').length}</p>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-2">Total Logs</p>
                <p className="font-semibold">{tasks.reduce((sum, task) => sum + (task.updates?.length || 0), 0)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div id="attendance" className="grid xl:grid-cols-[1.4fr_1fr] gap-6 mb-8">
          <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Attendance</h2>
                <p className="text-sm text-gray-400">Mark your daily status and review recent attendance records.</p>
              </div>
              <CalendarCheck className="w-6 h-6 text-orange-400" />
            </div>
            <div className="space-y-5">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase tracking-widest text-gray-400 pb-2">Today</p>
                <p className="text-3xl font-bold">{attendanceStatus}</p>
                <p className="text-sm text-gray-500 mt-1">{today}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {['Present', 'Absent', 'On Leave'].map((status) => (
                  <button
                    key={status}
                    onClick={() => postAttendance(status)}
                    className="rounded-3xl border border-white/10 bg-white/5 py-4 text-sm font-semibold text-gray-200 hover:bg-white/10 transition"
                  >
                    Mark {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Recent Attendance</h2>
            {loadingAttendance ? (
              <div className="text-gray-400">Loading attendance...</div>
            ) : attendance.length === 0 ? (
              <div className="text-gray-400">No attendance records found.</div>
            ) : (
              <div className="space-y-3">
                {attendance.slice(0, 5).map((record) => (
                  <div key={record.id} className="rounded-3xl bg-white/5 p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{record.date}</p>
                      <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full ${statusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    {record.status === 'On Leave' && <p className="text-xs text-gray-400">Vacation / leave request logged.</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'vacation' && (
        <div id="vacation" className="grid xl:grid-cols-[1.4fr_1fr] gap-6 mb-8">
          <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Vacation Request</h2>
            <p className="text-gray-400 mb-6">Submit a quick vacation request for your field assignment. The admin will review and update your attendance status.</p>
            <textarea
              value={vacationNote}
              onChange={(e) => setVacationNote(e.target.value)}
              placeholder="Describe the reason for your leave request..."
              className="w-full min-h-[180px] bg-[#020617] border border-white/10 rounded-3xl p-5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={requestVacation}
              className="mt-6 w-full bg-orange-500 hover:bg-orange-400 text-black rounded-3xl py-4 font-bold transition"
            >
              Send Vacation Request
            </button>
            {vacationRequested && (
              <p className="mt-4 text-sm text-green-300">Vacation request submitted. Please wait for approval.</p>
            )}
          </div>

          <div className="bg-[#0f172a] p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Leave Notes</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                <p className="font-semibold">How it works</p>
                <p className="text-gray-400 mt-2">When you submit a vacation request, your attendance status is recorded as <strong>On Leave</strong>. Your team lead and admin can review it.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                <p className="font-semibold">Tip</p>
                <p className="text-gray-400 mt-2">Use this for short-term leave or emergency time off from field work.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div id="tasks" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-wide">Your Dispatched Tasks</h2>
              <p className="text-gray-400 text-sm mt-1">Track tasks, upload field updates, and mark work progress.</p>
            </div>
            <div className="space-x-3 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-white/5 border border-white/10">Active <strong>{tasks.filter((task) => task.status !== 'Completed').length}</strong></span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-3xl bg-white/5 border border-white/10">Completed <strong>{tasks.filter((task) => task.status === 'Completed').length}</strong></span>
            </div>
          </div>

          {loadingTasks ? (
            <div className="text-center py-10 opacity-50"><Activity className="w-8 h-8 animate-spin mx-auto text-orange-500"/></div>
          ) : tasks.length === 0 ? (
            <div className="text-center space-y-4 py-16 bg-white/5 rounded-3xl border border-white/5">
              <HardHat className="w-16 h-16 text-gray-700 mx-auto" />
              <p className="text-gray-400 font-semibold text-lg">No active assignments.</p>
              <p className="text-xs text-gray-500">Your agent will assign a task once the installation is ready.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Site Assignment</h3>
                      <p className="text-sm text-gray-400">Booking #{task.booking} · {task.status}</p>
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${statusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl mb-6 border border-white/5">
                    <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-gray-300 leading-relaxed">
                      {task.location_link || 'No location provided yet.'}
                    </p>
                  </div>

                  {task.updates && task.updates.length > 0 && (
                    <div className="bg-[#020617] rounded-xl p-4 border border-white/5 mb-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Recent Updates</h4>
                      <div className="space-y-3">
                        {task.updates.map((up) => (
                          <div key={up.id} className="flex gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                            {up.photo && <img src={up.photo} alt="update" className="w-16 h-16 object-cover rounded shadow-md" />}
                            <div>
                              <p className="text-xs text-gray-300 font-medium">{up.description}</p>
                              <p className="text-[10px] text-gray-500 mt-1">{new Date(up.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.status === 'Dispatched' && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'In Progress')}
                      className="w-full py-4 rounded-xl font-bold text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 transition"
                    >
                      Start Work (Arrived at Site)
                    </button>
                  )}

                  {task.status === 'In Progress' && (
                    <div className="space-y-4">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <h4 className="text-sm font-bold text-orange-400">Upload Task Update</h4>
                        <textarea
                          placeholder="Describe the work completed..."
                          className="w-full bg-[#020617] text-white text-sm p-3 rounded outline-none border border-white/10 focus:border-orange-500 resize-none h-24"
                          value={updateText}
                          onChange={(e) => setUpdateText(e.target.value)}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500/20"
                          onChange={(e) => setUpdatePhoto(e.target.files[0])}
                        />
                        <button
                          onClick={() => submitUpdate(task.id)}
                          disabled={isUpdating}
                          className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl text-sm transition disabled:opacity-50"
                        >
                          {isUpdating ? 'Uploading...' : 'Upload Photo & Note'}
                        </button>
                      </div>
                      <button
                        onClick={() => handleUpdateStatus(task.id, 'Completed')}
                        className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-500 text-black hover:from-emerald-400 hover:to-green-400 transition shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}

                  {task.status === 'Completed' && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-bold text-sm tracking-wide">Work Finished Successfully</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default WorkerDashboard;
