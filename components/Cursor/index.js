import React, { useEffect } from "react";

const Cursor = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only run on desktop
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return;
    }
    // Remove any existing cursor
    const oldCursor = document.getElementById("custom-cursor");
    if (oldCursor) oldCursor.remove();
    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    cursor.style.position = "fixed";
    cursor.style.top = "0px";
    cursor.style.left = "0px";
    cursor.style.width = "24px";
    cursor.style.height = "24px";
    cursor.style.border = "2px solid #333";
    cursor.style.borderRadius = "50%";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "99999";
    cursor.style.transform = "translate(-50%, -50%)";
    cursor.style.transition = "background 0.2s, border 0.2s";
    cursor.style.background = "rgba(255,255,255,0.01)";
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      if (document.getElementById("custom-cursor")) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return null;
};

export default Cursor;
