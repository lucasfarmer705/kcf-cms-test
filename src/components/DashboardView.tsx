import React from "react";
import { User } from "firebase/auth";
import { PageData } from "../cmsDefaults";
import { 
  FileText, 
  FileEdit, 
  CheckCircle, 
  ImageIcon, 
  Plus, 
  ExternalLink, 
  Database,
  LayoutDashboard,
  LogOut,
  PenTool,
  Clock
} from "lucide-react";

interface DashboardViewProps {
  pages: PageData[];
  mediaItems: any[];
  user: User;
  setActiveTab: (tab: "dashboard" | "pages" | "media" | "settings" | "add_new_page") => void;
  setSelectedPage: (page: PageData | null) => void;
  setPageFilter: (filter: "all" | "draft" | "published") => void;
  quickDraftTitle: string;
  setQuickDraftTitle: (v: string) => void;
  quickDraftSlug: string;
  setQuickDraftSlug: (v: string) => void;
  handleCreateQuickDraft: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  pages,
  mediaItems,
  user,
  setActiveTab,
  setSelectedPage,
  setPageFilter,
  quickDraftTitle,
  setQuickDraftTitle,
  quickDraftSlug,
  setQuickDraftSlug,
  handleCreateQuickDraft
}) => {
  // Sort pages by updatedAt to show recent edits (or fallback to title if updatedAt doesn't exist)
  const sortedPagesByEdit = [...pages].sort((a, b) => {
    const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="space-y-4 text-left animate-fade-in-up" id="wp-dashboard-view">
      
      {/* 1. COMPACT WELCOME HEADER */}
      <div className="bg-white border border-slate-300 rounded p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-lg font-extrabold text-slate-900 text-left m-0 font-sans tracking-tight leading-tight flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-slate-700" />
            <span>Dashboard</span>
          </h2>
          <p className="text-xs text-slate-700 text-left m-0 font-sans font-medium">
            Welcome to your KCF administration panel. Quick overview of site health and content pipelines.
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <button
            onClick={() => setActiveTab("add_new_page")}
            className="w-full sm:w-auto bg-[#2271b1] hover:bg-[#135e96] text-white border border-[#135e96] text-xs font-bold px-4 py-2 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Page</span>
          </button>
        </div>
      </div>

      {/* 2. COMPACT AT-A-GLANCE STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          onClick={() => { setActiveTab("pages"); setPageFilter("all"); }}
          className="bg-white border border-slate-305 hover:border-slate-400 rounded p-3 flex items-center gap-3 cursor-pointer transition-colors shadow-xs"
        >
          <div className="w-9 h-9 rounded bg-blue-100 text-[#135e96] flex items-center justify-center shrink-0 border border-blue-200">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-black font-mono text-slate-900 leading-none">{pages.length}</div>
            <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wide mt-1.5 truncate">Total Pages</div>
          </div>
        </div>

        <div 
          onClick={() => { setActiveTab("pages"); setPageFilter("draft"); }}
          className="bg-white border border-slate-305 hover:border-slate-400 rounded p-3 flex items-center gap-3 cursor-pointer transition-colors shadow-xs"
        >
          <div className="w-9 h-9 rounded bg-amber-100 text-amber-850 flex items-center justify-center shrink-0 border border-amber-200">
            <FileEdit className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-black font-mono text-slate-900 leading-none">
              {pages.filter(p => p.status === "draft").length}
            </div>
            <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wide mt-1.5 truncate">Active Drafts</div>
          </div>
        </div>

        <div 
          onClick={() => { setActiveTab("pages"); setPageFilter("published"); }}
          className="bg-white border border-slate-305 hover:border-slate-400 rounded p-3 flex items-center gap-3 cursor-pointer transition-colors shadow-xs"
        >
          <div className="w-9 h-9 rounded bg-emerald-100 text-emerald-850 flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-black font-mono text-slate-900 leading-none">
              {pages.filter(p => p.status === "published").length}
            </div>
            <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wide mt-1.5 truncate">Published Pages</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab("media")}
          className="bg-white border border-slate-305 hover:border-slate-400 rounded p-3 flex items-center gap-3 cursor-pointer transition-colors shadow-xs"
        >
          <div className="w-9 h-9 rounded bg-indigo-100 text-indigo-850 flex items-center justify-center shrink-0 border border-indigo-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-xl font-black font-mono text-slate-900 leading-none">{mediaItems.length}</div>
            <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wide mt-1.5 truncate">Media Assets</div>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN WORDPRESS-STYLE WIDGET ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column Widgets */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Action A: At a Glance list-style widget */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-300 flex items-center justify-between">
              <h3 className="text-xs font-bold font-sans uppercase text-slate-800 tracking-wider m-0">At a Glance</h3>
              <span className="text-[10px] text-[#135e96] font-mono font-bold">System Summary</span>
            </div>
            
            <div className="p-3.5 space-y-2.5 text-xs text-slate-800">
              <div className="grid grid-cols-2 gap-3 divide-x divide-slate-200">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-sans font-bold">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>{pages.length} Pages</span>
                  </div>
                  <div className="pl-6 text-[11px] text-slate-700 font-mono font-semibold space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{pages.filter(p => p.status === "published").length} Published</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>{pages.filter(p => p.status === "draft").length} Drafts</span>
                    </div>
                  </div>
                </div>
                
                <div className="pl-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-900 font-sans font-bold">
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>{mediaItems.length} Uploaded Assets</span>
                  </div>
                  <div className="pl-6 text-[11px] text-slate-705 font-sans leading-relaxed font-medium">
                    Serving dynamic headers and customizable church flyers.
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2.5 flex items-center gap-2 text-[11px] text-slate-800 font-medium">
                <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Running on <strong>Google Cloud Firestore</strong> sandbox database</span>
              </div>
            </div>
          </div>

          {/* Action B: Quick Draft Builder widget */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-300 flex items-center justify-between">
              <h3 className="text-xs font-bold font-sans uppercase text-slate-800 tracking-wider m-0">Quick Draft</h3>
              <span className="text-[10px] text-[#135e96] font-mono font-bold">Instant Creator</span>
            </div>
            
            <div className="p-3.5 space-y-3 font-sans text-xs">
              <div>
                <input
                  type="text"
                  placeholder="Enter page title (e.g. Youth Ministry)..."
                  value={quickDraftTitle}
                  onChange={(e) => {
                    setQuickDraftTitle(e.target.value);
                    if (!quickDraftSlug) {
                      setQuickDraftSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_"));
                    }
                  }}
                  className="w-full border border-slate-300 rounded px-2.5 py-2 text-xs focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-500 bg-white font-medium text-slate-900"
                />
              </div>

              <div className="flex">
                <span className="bg-slate-200 px-2.5 border border-slate-300 border-r-0 rounded-l text-[11px] font-mono select-none text-slate-800 flex items-center font-bold">
                  slug:/
                </span>
                <input
                  type="text"
                  placeholder="custom_slug"
                  value={quickDraftSlug}
                  onChange={(e) => setQuickDraftSlug(e.target.value)}
                  className="flex-1 border border-slate-300 px-2.5 py-2 text-xs font-mono rounded-r focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all bg-white font-bold text-slate-900"
                />
              </div>

              <button
                type="button"
                disabled={!quickDraftTitle.trim()}
                onClick={handleCreateQuickDraft}
                className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white disabled:bg-slate-100 disabled:text-slate-400 text-xs py-2 px-3 font-extrabold transition-all rounded shadow-sm cursor-pointer text-center"
              >
                Save as Draft Page
              </button>
            </div>
          </div>
        </div>

        {/* Right Column Widgets */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Action C: Recent website edits CMS list */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-300 flex items-center justify-between">
              <h3 className="text-xs font-bold font-sans uppercase text-slate-800 tracking-wider m-0">Recent Layout Activity</h3>
              <button 
                onClick={() => { setActiveTab("pages"); setPageFilter("all"); }}
                className="text-[11px] text-[#2271b1] hover:text-[#135e96] font-bold"
              >
                All Pages &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-200 text-xs">
              {sortedPagesByEdit.slice(0, 5).map((p) => {
                const displayDate = p.updatedAt 
                  ? new Date(p.updatedAt).toLocaleDateString(undefined, {month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})
                  : "Original layout";
                
                return (
                  <div key={p.route} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span 
                          className="font-extrabold text-slate-900 hover:text-[#2271b1] cursor-pointer block truncate text-xs" 
                          onClick={() => { setSelectedPage(p); setActiveTab("pages"); }}
                        >
                          {p.title}
                        </span>
                        {p.isCustom && (
                          <span className="text-[9px] font-mono font-bold bg-blue-105 border border-blue-200 text-[#135e96] px-1 py-0.2 rounded shrink-0">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono font-medium">
                        <span className="truncate">/{p.route}</span>
                        <span>•</span>
                        <span className="text-[10px] flex items-center gap-0.5 text-slate-700 font-sans">
                          <Clock className="w-2.5 h-2.5 text-slate-500" />
                          <span>{displayDate}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold tracking-wide uppercase shrink-0 ${
                        p.status === "published" 
                          ? "bg-green-100 text-green-950 border border-green-300" 
                          : "bg-amber-100 text-amber-950 border border-amber-300"
                      }`}>
                        {p.status}
                      </span>
                      <button
                        onClick={() => { setSelectedPage(p); setActiveTab("pages"); }}
                        className="text-xs text-[#2271b1] hover:text-[#135e96] font-bold"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* 4. PUBLIC PAGE ROUTE DIRECTORY MAP - SIMPLIFIED COMPACT DIRECTORY */}
        <div className="lg:col-span-12 bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
          <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-300 flex items-center justify-between">
            <h3 className="text-xs font-bold font-sans uppercase text-slate-800 tracking-wider m-0">
              Landing Page Directory paths
            </h3>
            <span className="text-[9px] bg-green-150 border border-emerald-300 text-green-950 font-extrabold px-1.5 py-0.2 rounded font-mono uppercase">
              Online
            </span>
          </div>

          <div className="p-3.5 space-y-2.5">
            <p className="text-xs text-slate-700 text-left font-semibold m-0">
              Select any public route mapping to view dynamic frontend design modifications live.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {pages.map((p) => (
                <div key={p.route} className="bg-slate-50 border border-slate-300 rounded px-2.5 py-2 flex items-center justify-between gap-3 text-xs shadow-2xs">
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-900 block truncate text-xs">{p.title}</span>
                    <span className="text-[10px] font-mono text-slate-600 font-medium">/{p.route === "home" ? "" : p.route}</span>
                  </div>
                  <a
                    href={`/${p.route === "home" ? "" : p.route}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-800 text-[10px] font-bold border border-slate-300 rounded px-2.5 py-1 flex items-center gap-1 transition-all shadow-xs"
                  >
                    <span>View</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
