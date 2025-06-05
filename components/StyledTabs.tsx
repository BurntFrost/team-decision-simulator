"use client";

import React from "react";

const StyledTabs: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full overflow-hidden">
    <style jsx>{`
      :global([data-state="active"]) {
        background-color: hsl(var(--primary) / 0.1) !important;
        color: hsl(var(--primary)) !important;
        font-weight: 600;
      }
    `}</style>
    {children}
  </div>
);

export default StyledTabs;
