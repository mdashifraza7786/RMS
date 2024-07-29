// components/LoginManager.tsx
"use client"; // Ensure this component is a client component

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import NextTopLoader from "nextjs-toploader";
import Login from "@/components/Login";

const MiddleWare: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    
    useEffect(() => {
      // Simulate loading and check localStorage
      setTimeout(() => {
        const loggedStatus = localStorage.getItem("islogged") === "true";
        setIsLogged(loggedStatus);
        setLoading(false);
      }, 1000); // simulate loading time
    }, []);
    
    return (
      <div>
        {loading ? (
          <h1 className="text-3xl">Loading...</h1>
        ) : isLogged ? (
          <>
            <NextTopLoader color="#FFFFFF" />
            <AdminNavbar />
            {children}
          </>
        ) : (
          <Login />
        )}
      </div>
    );
    
};

export default MiddleWare;
