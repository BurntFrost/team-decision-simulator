"use client";

import React, { useState, useEffect } from "react";
import { BsClockFill, BsGeoAlt } from "react-icons/bs";

const IOSStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-[#007aff] text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xs font-bold">{time}</div>
      <div className="flex items-center space-x-1">
        <div className="w-3 h-3" aria-hidden="true">
          <BsClockFill className="w-full h-full" />
        </div>
        <div className="w-4 h-4" aria-hidden="true">
          <BsGeoAlt className="w-full h-full" />
        </div>
        <div className="w-6 h-5" aria-hidden="true">
          <div className="h-full relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center px-0.5">
              <div className="h-2 rounded-sm w-1 bg-white mx-0.5" />
              <div className="h-3 rounded-sm w-1 bg-white mx-0.5" />
              <div className="h-4 rounded-sm w-1 bg-white mx-0.5" />
              <div className="h-2.5 rounded-sm w-1 bg-white mx-0.5" />
            </div>
          </div>
        </div>
        <div className="w-6 h-3 border border-white rounded-sm relative" aria-hidden="true">
          <div className="absolute right-0 top-0 bottom-0 bg-white w-3 mr-px my-px rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default IOSStatusBar;
