import React from "react";
import { PageData } from "../cmsDefaults";
import { 
  Plus, 
  FileText, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Clock, 
  User 
} from "lucide-react";

interface PagesTableViewProps {
  pages: PageData[];
  pageFilter: "all" | "draft" | "published";
  setPageFilter: (filter: "all" | "draft" | "published") => void;
  setSelectedPage: (page: PageData | null) => void;
  handleDeletePage: (route: string) => void;
  setActiveTab: (tab: "dashboard" | "pages" | "media" | "settings" | "add_new_page") => void;
}

export const PagesTableView: React.FC<PagesTableViewProps> = ({
  pages,
  pageFilter,
  setPageFilter,
  setSelectedPage,
  handleDeletePage,
  setActiveTab
}) => {
  const filteredPages = pages.filter((p) => {
    if (pageFilter === "draft") return p.status === "draft";
    if (pageFilter === "published") return p.status === "published";
    return true;
  });

  return (
    <div className="space-y-3.5 text-left animate-fade-in-up" id="wp-pages-table-view">
      
      {/* 1. COMPACT CMS-STYLE TITLE WITH ADD NEW BUTTON AT RIGHT SIDE OF TITLE */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-300 pb-2.5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-extrabold text-slate-900 m-0 font-sans tracking-tight leading-none">
            Pages
          </h2>
          <button
            onClick={() => setActiveTab("add_new_page")}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white border border-[#135e96] text-[11px] font-bold px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1 shadow-sm uppercase shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>Add New</span>
          </button>
        </div>
        <span className="text-[11px] text-[#135e96] font-mono font-bold uppercase tracking-wider hidden sm:inline">CMS Page Hub</span>
      </div>

      {/* 2. FILTER MENU ROW - INLINE WORDPRESS-STYLE */}
      <div className="flex gap-3 text-[11px] border-b border-slate-300 pb-2 pt-0.5">
        <button
          onClick={() => setPageFilter("all")}
          className={`font-semibold cursor-pointer px-1 py-0.5 transition-colors ${
            pageFilter === "all" 
              ? "text-slate-900 border-b-2 border-slate-950 font-extrabold text-xs" 
              : "text-[#2271b1] hover:text-[#135e96]"
          }`}
        >
          All <span className="text-slate-500 font-bold">({pages.length})</span>
        </button>
        <span className="text-slate-400 font-light">|</span>
        <button
          onClick={() => setPageFilter("published")}
          className={`font-semibold cursor-pointer px-1 py-0.5 transition-colors ${
            pageFilter === "published" 
              ? "text-slate-900 border-b-2 border-slate-950 font-extrabold text-xs" 
              : "text-[#2271b1] hover:text-[#135e96]"
          }`}
        >
          Published <span className="text-slate-500 font-bold">({pages.filter(p => p.status === "published").length})</span>
        </button>
        <span className="text-slate-400 font-light">|</span>
        <button
          onClick={() => setPageFilter("draft")}
          className={`font-semibold cursor-pointer px-1 py-0.5 transition-colors ${
            pageFilter === "draft" 
              ? "text-slate-900 border-b-2 border-slate-950 font-extrabold text-xs" 
              : "text-[#2271b1] hover:text-[#135e96]"
          }`}
        >
          Drafts <span className="text-slate-500 font-bold">({pages.filter(p => p.status === "draft").length})</span>
        </button>
      </div>

      {/* 3. CONDENSED ADMINISTRATIVE TABLE */}
      <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase tracking-wider text-[11.5px]">
              <th className="p-3 w-5/12 pl-4">Title</th>
              <th className="p-3 w-3/12">Slug</th>
              <th className="p-3 w-1.5/12">Status</th>
              <th className="p-3 w-2.5/12">Date Updated</th>
              <th className="p-3 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredPages.map((p) => {
              const displayDate = p.updatedAt 
                ? new Date(p.updatedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Initial Default";

              return (
                <tr key={p.route} className="hover:bg-slate-50 transition-colors group">
                  
                  {/* WordPress Custom List Action Link List */}
                  <td className="p-3 pl-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-sans">
                        <span 
                          onClick={() => setSelectedPage(p)} 
                          className="font-extrabold text-[#2271b1] group-hover:text-[#135e96] hover:underline cursor-pointer text-[13.5px] leading-tight"
                        >
                          {p.title}
                        </span>
                        
                        {p.status === "draft" && (
                          <span className="text-[9px] bg-amber-55 text-amber-950 px-1.5 py-0.2 rounded font-bold font-sans tracking-wide shrink-0 border border-amber-300">
                            Draft
                          </span>
                        )}
                        {p.isCustom && (
                          <span className="text-[9px] bg-indigo-50 text-indigo-950 px-1.5 py-0.2 rounded font-mono font-bold shrink-0 border border-indigo-200 uppercase">
                            Custom Template
                          </span>
                        )}
                      </div>

                      {/* Explicitly visible operations bar conforming to WP UX directions */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold py-0.5">
                        <button 
                          onClick={() => setSelectedPage(p)}
                          className="text-[#2271b1] hover:text-[#135e96] hover:underline font-bold"
                        >
                          Edit Sections
                        </button>
                        <span className="text-slate-300 font-light select-none">|</span>
                        <a 
                          href={`/${p.route === "home" ? "" : p.route}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-slate-700 hover:text-[#2271b1] hover:underline font-bold flex items-center gap-0.5"
                        >
                          View Live <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                        </a>
                        {p.isCustom && (
                          <>
                            <span className="text-slate-300 font-light select-none">|</span>
                            <button 
                              onClick={() => handleDeletePage(p.route)}
                              className="text-red-700 hover:text-red-900 hover:underline font-bold"
                            >
                              Trash
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Route path slug */}
                  <td className="p-3 font-mono text-[11.5px] text-slate-800 font-bold">
                    /{p.route === "home" ? "" : p.route}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3">
                    <span className={`text-[9.5px] px-2.0 py-0.5 rounded font-extrabold tracking-wide uppercase ${
                      p.status === "published" 
                        ? "bg-green-100 text-green-950 border border-green-300" 
                        : "bg-amber-100 text-amber-950 border border-amber-300"
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  {/* Date updated indicator */}
                  <td className="p-3 text-slate-800 font-mono text-[11px] leading-tight font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <div className="font-bold text-slate-900">{displayDate}</div>
                        <div className="text-[10px] text-slate-600 font-sans font-bold">by lucas</div>
                      </div>
                    </div>
                  </td>

                  {/* Icon buttons action block */}
                  <td className="p-3 text-right pr-4 shrink-0">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => setSelectedPage(p)}
                        className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 p-1.5 rounded hover:border-slate-400 hover:text-slate-950 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                        title="Configure layout sections"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      
                      {p.isCustom && (
                        <button
                          onClick={() => handleDeletePage(p.route)}
                          className="bg-red-50 hover:bg-red-100 border border-red-300 hover:text-red-800 p-1.5 rounded hover:border-red-400 transition-all flex items-center justify-center cursor-pointer shadow-xs"
                          title="Trash template"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-700" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
              
              {filteredPages.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-800 font-bold bg-slate-50 font-sans">
                    No CMS page profiles matched this category selection.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
