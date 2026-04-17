import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';


export const TicketContext = createContext();

export const useTickets = () => useContext(TicketContext);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await api.get('support-tickets/');
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);


  const addTicket = async (customerName, issueType, description) => {
    const user = JSON.parse(sessionStorage.getItem('solar_user'));
    if (!user) return;

    try {
      const res = await api.post('support-tickets/', {
        client: user.id,
        ticket_no: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
        type: issueType,
        description: description,
        status: 'Pending'
      });
      setTickets(prev => [res.data, ...prev]);
      return res.data.ticket_no;
    } catch (err) {
      console.error("Error raising ticket:", err);
    }
  };

  const resolveTicket = async (id) => {
    try {
      const res = await api.patch(`support-tickets/${id}/`, {
        status: 'Resolved',
        resolved_at: new Date().toISOString()
      });
      setTickets(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error("Error resolving ticket:", err);
    }
  };

  const assignTicket = async (id, workerId, workerName) => {
    try {
      const res = await api.patch(`support-tickets/${id}/`, {
        status: 'Dispatched',
        assigned_worker: workerId
      });
      setTickets(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) {
      console.error("Error assigning ticket:", err);
    }
  };

  const clearTickets = () => {
    setTickets([]);
  };

  return (
    <TicketContext.Provider value={{ tickets, loading, addTicket, resolveTicket, assignTicket, clearTickets, fetchTickets }}>
      {children}
    </TicketContext.Provider>
  );
};
