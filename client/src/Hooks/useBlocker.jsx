import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
export function useLockPage(loading ) {
  // 1. Prevent Browser Refresh/Close (Standard Browser Alert)
  useEffect(() => {
    const handleRefresh = (e) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = ""; 
      }
    };
    window.addEventListener("beforeunload", handleRefresh);
    return () => window.removeEventListener("beforeunload", handleRefresh);
  }, [loading ]);

  // 2. Prevent Route Change (Custom JavaScript Alert)
  useBlocker(() => {
    if (loading) {
      const confirmLeave = window.confirm("Progress will be lost. Are you sure you want to leave?");
      return !confirmLeave; // Returns true to block, false to proceed
    }
    return false;
  });
}