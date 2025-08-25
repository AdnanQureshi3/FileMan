import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import StatsGrid from "./StatGrids";
import ProfilePage from "./ProfilePage";
import Home from "./Home";
import MyFilePage from "./MyFilePage";
import UploadPage from "./UploadPage";
import FileShow from "./FileShow";
// import Logout from "./Logout";
import PurchasePage from "./PurchasePage";
import Footer from "./Footer";

const UserDashBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold text-gray-700 animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen flex pb-20 bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen}  setSidebarOpen={setSidebarOpen} setActiveTab={setActiveTab} activeTab={activeTab}/>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="flex flex-col flex-1">
        {/* sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} */}
        <Header  />
        <main className="flex-1 p-6 mt-20">
          {activeTab === "upload" && <UploadPage setActiveTab={setActiveTab}  />}
          {activeTab === "profile" && <ProfilePage />}
          {activeTab === "settings" && <ProfilePage />}
          {activeTab === "files" && <MyFilePage />}
          {activeTab === "plans" && <PurchasePage />}
          {activeTab === "logout" && <PurchasePage />}
          {activeTab === "home" && 

           <>
          {/* <Home /> */}
          <StatsGrid />
          <FileShow />
         </>
           }
           
        </main>
        
      </div>
      
    </div>
    <Footer setActiveTab={setActiveTab}/>
    </>
    
  );
};

export default UserDashBoard;