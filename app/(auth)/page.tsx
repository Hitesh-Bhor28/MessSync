"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import LoginScreen from "@/components/LoginScreen";

export default function AuthPage() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <LoginScreen />;
}
