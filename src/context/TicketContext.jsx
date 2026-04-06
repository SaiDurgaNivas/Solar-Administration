import React, { createContext, useState, useEffect, useContext } from 'react';

export const TicketContext = createContext();

export const useTickets = () => useContext(TicketContext);

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = sessionStorage.getItem('solar_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem('solar_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (customerName, issueType, description) => {
    const newTicket = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      customerName,
      type: issueType,
      description,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      resolvedAt: null
    };
    setTickets(prev => [newTicket, ...prev]);
    return newTicket.id;
  };

  const resolveTicket = (id) => {
    setTickets(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, status: 'Resolved', resolvedAt: new Date().toISOString() } 
          : t
      )
    );
  };

  const assignTicket = (id, workerId, workerName) => {
    setTickets(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, status: 'Dispatched', assignedWorkerId: workerId, assignedWorkerName: workerName } 
          : t
      )
    );
  };

  const clearTickets = () => {
    setTickets([]);
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, resolveTicket, assignTicket, clearTickets }}>
      {children}
    </TicketContext.Provider>
  );
};
