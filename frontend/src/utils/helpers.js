//
// 📅 Format Date (DD-MM-YYYY)
//
export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

//
// 💰 Format Currency (INR)
//
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "₹0";

  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

//
// 🔤 Capitalize First Letter
//
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

//
// 📧 Validate Email
//
export const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

//
// 🔑 Generate Random ID
//
export const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

//
// 📊 Calculate Total
//
export const calculateTotal = (items) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0);
};

//
// 🔍 Filter Search
//
export const searchFilter = (list, searchText) => {
  if (!searchText) return list;

  return list.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );
};