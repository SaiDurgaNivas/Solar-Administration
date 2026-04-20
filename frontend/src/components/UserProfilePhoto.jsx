import React, { useState, useEffect, useRef } from "react";

function UserProfilePhoto({ user, size = "md", className = "", clickable = false, onPhotoUpdate }) {
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const emailKey = user?.email || "default_user";

  useEffect(() => {
    const savedPhoto = sessionStorage.getItem(`profile_photo_${emailKey}`);
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
  }, [emailKey]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.detail.email === emailKey) {
        setPhoto(e.detail.photo);
      }
    };
    window.addEventListener("profilePhotoUpdated", handleStorageChange);
    return () => window.removeEventListener("profilePhotoUpdated", handleStorageChange);
  }, [emailKey]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Image size too large. Please select an image under 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
         const base64String = reader.result;
         setPhoto(base64String);
         sessionStorage.setItem(`profile_photo_${emailKey}`, base64String);
         
         // Trigger a custom event so other components can update
         window.dispatchEvent(new CustomEvent("profilePhotoUpdated", { detail: { email: emailKey, photo: base64String } }));
         if (onPhotoUpdate) onPhotoUpdate(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  let sizeClasses = "w-8 h-8 text-sm";
  if (size === "sm") sizeClasses = "w-6 h-6 text-xs";
  if (size === "lg") sizeClasses = "w-10 h-10 text-lg";
  if (size === "xl") sizeClasses = "w-16 h-16 text-2xl";
  if (size === "2xl") sizeClasses = "w-32 h-32 md:w-40 md:h-40 text-4xl";

  const renderInitial = () => {
      if (user?.username) return user.username.charAt(0).toUpperCase();
      if (user?.name) return user.name.charAt(0).toUpperCase();
      return "U";
  }

  return (
    <div className={`relative group shrink-0 ${className}`}>
      <div 
        className={`${sizeClasses} bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex flex-col items-center justify-center text-black font-extrabold shadow-[0_0_15px_rgba(249,115,22,0.3)] relative overflow-hidden ${clickable ? 'cursor-pointer hover:scale-[1.03] transition-transform duration-300' : ''}`}
        onClick={(e) => { if (clickable) { e.stopPropagation(); fileInputRef.current?.click(); } }}
      >
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>
        {photo ? (
          <img src={photo} alt="Profile" className="w-full h-full object-cover relative z-10 pointer-events-none" />
        ) : (
          <span className="relative z-10 pointer-events-none opacity-90">{renderInitial()}</span>
        )}
        
        {/* Dedicated Upload Text Overlay instead of Camera Icon */}
        {clickable && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none text-white font-bold text-xs">
                Upload Photo
            </div>
        )}
      </div>

      {clickable && (
        <input 
          type="file" 
          accept=".png, .jpg, .jpeg, .webp" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handlePhotoUpload} 
        />
      )}
    </div>
  );
}

export default UserProfilePhoto;
