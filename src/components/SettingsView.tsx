import React from "react";
import { User } from "firebase/auth";
import { Database, ShieldCheck, HardDrive } from "lucide-react";

interface SettingsViewProps {
  user: User;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user }) => {
  return (
    <div className="space-y-4 text-left animate-fade-in-up" id="wp-settings-view">
      
      {/* Title block */}
      <div className="border-b border-slate-300 pb-2.5">
        <h2 className="text-lg font-extrabold text-slate-900 m-0 font-sans tracking-tight leading-none">
          Portal System Settings
        </h2>
        <p className="text-xs text-slate-705 mt-1 m-0 font-sans font-semibold">
          Synchronized system parameters and cloud identity configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Cloud Firestore */}
        <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm text-xs font-sans">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2.5 m-0 flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-700" />
            <span>Database Status</span>
          </h3>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-700 font-bold">Firestore Instance:</span>
              <span className="font-mono text-[10.5px] bg-slate-200 text-slate-950 font-bold border border-slate-300 px-2 py-0.5 rounded">
                ai-studio-8ef325f4-*
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-700 font-bold">Primary Architect:</span>
              <span className="font-mono text-[10.5px] bg-slate-200 text-slate-950 font-bold border border-slate-300 px-2 py-0.5 rounded">
                lucasfarmer2008@gmail.com
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-700 font-bold">Sync Connection:</span>
              <span className="text-emerald-950 bg-emerald-100 border border-emerald-300 font-extrabold font-mono text-[9.5px] uppercase flex items-center gap-1.5 px-2 py-0.5 rounded shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Active Link</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Identity Session details */}
        <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm text-xs font-sans">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2.5 m-0 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>Operator Integrity</span>
          </h3>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-700 font-bold">Session Operator:</span>
              <span className="font-black text-slate-950 font-mono text-[11px] max-w-[170px] truncate" title={user.email || ""}>
                {user.email || "Offline admin user"}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-700 font-bold">Firebase Session UID:</span>
              <span className="font-mono text-[10px] text-slate-950 font-bold bg-slate-200 border border-slate-300 px-2 py-0.5 rounded max-w-[150px] truncate" title={user.uid}>
                {user.uid}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-700 font-bold">Authorize Level:</span>
              <span className="text-[#135e96] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono text-[10px] font-extrabold uppercase shadow-2xs">
                {user.emailVerified ? "OAuth Super Admin" : "Identity Approved"}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
