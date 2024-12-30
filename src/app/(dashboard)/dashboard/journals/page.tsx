import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const JournalsPage = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Journals</h1>
        </div>
      </div>
    </div>
  );
};

export default JournalsPage;
