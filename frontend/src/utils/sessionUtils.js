export const getSessionUser = () => {
  try {
    const userStr = sessionStorage.getItem("solar_user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing session user:", error);
    return null;
  }
};

export const setSessionUser = (user) => {
  if (user) {
    sessionStorage.setItem("solar_user", JSON.stringify(user));
  } else {
    sessionStorage.removeItem("solar_user");
  }
};
