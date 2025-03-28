"use client"

import { auth } from "./supabase";
import { useContext, createContext, useState, useEffect } from "react";

const GlobalState = createContext(undefined);

export function Global({ children }){
  const [isAuthUser, getCurrentUser] = useState();

  useEffect(() => {
    const { data } = auth.onAuthStateChange((event, session) => {
      if(session) getCurrentUser(session.user)
      else getCurrentUser(null)
    });
    return () => data.subscription.unsubscribe()
  }, [])
  
  const [theme, setTheme] = useState("default-os");
  const [onExceptionPage, setOnExceptionPage] = useState(false);
  const [device, detectDevice] = useState("pc");

  useEffect(() => {
    function detectingDevice(){
      if(window.innerWidth < 640) detectDevice("xs")
      else if(window.innerWidth < 768) detectDevice("sm")
      else if(window.innerWidth < 1024) detectDevice("md")
      else if(window.innerWidth < 1280) detectDevice("lg")
      else if(window.innerWidth < 1536) detectDevice("xl")
      else detectDevice("2xl");
    };

    detectingDevice();
    
    window.addEventListener("resize", detectingDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

  useEffect(() => {
    if(localStorage.getItem("theme") === null) localStorage.setItem("theme", theme)
    setTheme(localStorage.getItem("theme"))
  }, [])

  useEffect(() => localStorage.setItem("theme", theme), [theme])

  return(
    <GlobalState.Provider value={{
      theme: {theme, setTheme},
      authUser: {isAuthUser},
      exceptionPage: {onExceptionPage, setOnExceptionPage},
      device: {device, detectDevice}
    }}>
      {children}
    </GlobalState.Provider>
  );
};

export function useGlobal(){
  const context = useContext(GlobalState);
  if(!context){
    throw new Error("useGlobal must be used within a Global component!");
  };
  return context;
};