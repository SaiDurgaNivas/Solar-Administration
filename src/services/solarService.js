import API from "./api";

//
// ☀️ SOLAR PANELS
//

// Get all solar panels
export const getSolarPanels = async () => {
  try {
    const res = await API.get("/solar-panels");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch solar panels" };
  }
};

// Add new solar panel
export const addSolarPanel = async (data) => {
  try {
    const res = await API.post("/solar-panels", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add solar panel" };
  }
};

// Update solar panel
export const updateSolarPanel = async (id, data) => {
  try {
    const res = await API.put(`/solar-panels/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update solar panel" };
  }
};

// Delete solar panel
export const deleteSolarPanel = async (id) => {
  try {
    const res = await API.delete(`/solar-panels/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete solar panel" };
  }
};


//
// 🔧 INSTALLATIONS
//

// Get all installations
export const getInstallations = async () => {
  try {
    const res = await API.get("/installations");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch installations" };
  }
};

// Add installation
export const addInstallation = async (data) => {
  try {
    const res = await API.post("/installations", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add installation" };
  }
};

// Update installation
export const updateInstallation = async (id, data) => {
  try {
    const res = await API.put(`/installations/${id}`, data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update installation" };
  }
};

// Delete installation
export const deleteInstallation = async (id) => {
  try {
    const res = await API.delete(`/installations/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete installation" };
  }
};


//
// 📊 DASHBOARD DATA
//

// Get dashboard summary (stats)
export const getDashboardData = async () => {
  try {
    const res = await API.get("/dashboard");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch dashboard data" };
  }
};