import React, { useState, useEffect, useRef } from "react";
import { auth, db, googleProvider, signInWithPopup, signOut } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, getDocs, setDoc, deleteDoc, query, getDoc } from "firebase/firestore";
import { PageRoute } from "../types";
import { defaultCmsPages, PageData } from "../cmsDefaults";
import { CmsSection } from "./CmsSectionRenderer";

// Import modular subviews
import { DashboardView } from "./DashboardView";
import { PagesTableView } from "./PagesTableView";
import { MediaLibraryView } from "./MediaLibraryView";
import { SettingsView } from "./SettingsView";

import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings as SettingsIcon,
  LogOut,
  Save,
  Globe,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Compass,
  CheckCircle,
  FileEdit,
  ExternalLink,
  ChevronRight,
  Database,
  Menu,
  ChevronDown
} from "lucide-react";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
  
  // WordPress sidebar active tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "pages" | "media" | "settings" | "add_new_page">("dashboard");
  const [pageFilter, setPageFilter] = useState<"all" | "draft" | "published">("all");
  
  // Media states
  const [mediaItems, setMediaItems] = useState<Array<{ id: string; url: string; fileName: string; uploadedAt: any }>>([]);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Page creation state
  const [newPageTitle, setNewPageTitle] = useState<string>("");
  const [newPageSlug, setNewPageSlug] = useState<string>("");

  // Editor states
  const [isEditingSectionIdx, setIsEditingSectionIdx] = useState<number | null>(null);
  const [previewEnabled, setPreviewEnabled] = useState<boolean>(false);

  // Sidebar toggle state (for responsive screens)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Quick Draft text state for home screen draft generator
  const [quickDraftTitle, setQuickDraftTitle] = useState<string>("");
  const [quickDraftSlug, setQuickDraftSlug] = useState<string>("");

  // Firestore Error Handler
  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error Details: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const staticAuthorized = currentUser.email?.toLowerCase() === "lucasfarmer2008@gmail.com";
        let dbAuthorized = false;
        
        try {
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          const adminDoc = await getDoc(adminDocRef);
          dbAuthorized = adminDoc.exists();
        } catch (e) {
          console.warn("Could not check custom admins collection, fallback to email verify", e);
        }

        if (staticAuthorized || dbAuthorized) {
          setIsAdminUser(true);
          await loadPagesData();
          await loadMediaItems();
        } else {
          setIsAdminUser(false);
        }
      } else {
        setIsAdminUser(false);
      }
      setLoading(false);
    });

    const prevFlag = localStorage.getItem("cms_preview_enabled") === "true";
    setPreviewEnabled(prevFlag);

    return () => unsubscribe();
  }, []);

  // Fetch Firestore Pages Data
  const loadPagesData = async () => {
    const path = "pages";
    try {
      const q = query(collection(db, path));
      const querySnapshot = await getDocs(q);
      
      const dbPages: PageData[] = [];
      querySnapshot.forEach((doc) => {
        dbPages.push(doc.data() as PageData);
      });

      const mergedPagesMap: Record<string, PageData> = { ...defaultCmsPages };
      dbPages.forEach(p => {
        mergedPagesMap[p.route] = p;
      });

      const pagesList = Object.values(mergedPagesMap);
      setPages(pagesList);
      
      if (selectedPage) {
        const updatedSelected = pagesList.find(p => p.route === selectedPage.route);
        if (updatedSelected) setSelectedPage(updatedSelected);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  };

  // Fetch images metadata list
  const loadMediaItems = async () => {
    const path = "images";
    try {
      const snapshot = await getDocs(collection(db, path));
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      list.sort((a, b) => {
        const timeA = a.uploadedAt?.seconds || 0;
        const timeB = b.uploadedAt?.seconds || 0;
        return timeB - timeA;
      });
      setMediaItems(list);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Authentication failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdminUser(false);
    } catch (err) {
      console.error("Signout failed:", err);
    }
  };

  const processImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64data
          })
        });

        if (!response.ok) {
          const errBody = await response.json();
          throw new Error(errBody.error || "Server upload process failed");
        }

        const data = await response.json();
        
        const imageId = "img_" + Date.now();
        const path = `images/${imageId}`;
        const imageMetadata = {
          url: data.url,
          fileName: data.fileName,
          uploadedAt: { seconds: Math.floor(Date.now() / 1000) }
        };

        await setDoc(doc(db, "images", imageId), imageMetadata);
        
        await loadMediaItems();
        setUploadingImage(false);
        alert(`Successfully uploaded "${file.name}" to the media library!`);
      };
    } catch (err: any) {
      console.error("Upload error details:", err);
      alert("Failed to upload image asset: " + err.message);
      setUploadingImage(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processImageUpload(e.target.files[0]);
    }
  };

  const handleSaveDraft = async (pageToSave: PageData) => {
    const path = `pages/${pageToSave.route}`;
    try {
      await setDoc(doc(db, "pages", pageToSave.route), {
        ...pageToSave,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.uid || "admin"
      });
      await loadPagesData();
      alert("Draft changes for '" + pageToSave.title + "' saved successfully!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handlePublishLive = async (pageToSave: PageData) => {
    const path = `pages/${pageToSave.route}`;
    try {
      const publishedPage: PageData = {
        ...pageToSave,
        status: "published",
        publishedContent: JSON.parse(JSON.stringify(pageToSave.draftContent)),
        updatedAt: new Date().toISOString(),
        updatedBy: user?.uid || "admin"
      };
      
      await setDoc(doc(db, "pages", pageToSave.route), publishedPage);
      await loadPagesData();
      alert("SUCCESS: '" + pageToSave.title + "' published live immediately!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleDeletePage = async (route: string) => {
    if (!confirm("Are you sure you want to permanently delete/unpublish this page?")) return;
    const path = `pages/${route}`;
    try {
      await deleteDoc(doc(db, "pages", route));
      setSelectedPage(null);
      await loadPagesData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const createNewCustomPage = async () => {
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      alert("Please specify a valid Title and URL slug!");
      return;
    }
    const slug = newPageSlug.toLowerCase().replace(/[^a-z0-9\-_]/g, "_");
    
    if (pages.some(p => p.route === slug)) {
      alert("A page with this slug already exists!");
      return;
    }

    const newPage: PageData = {
      route: slug,
      title: newPageTitle,
      isCustom: true,
      status: "draft",
      publishedContent: { sections: [] },
      draftContent: { 
        sections: [
          {
            type: "standard_header",
            title: newPageTitle
          },
          {
            type: "paragraph_block",
            title: "WELCOME",
            text: "Welcome to our newly launched " + newPageTitle + " page. Our content sections go here."
          }
        ] 
      }
    };

    const path = `pages/${slug}`;
    try {
      await setDoc(doc(db, "pages", slug), newPage);
      setNewPageTitle("");
      setNewPageSlug("");
      await loadPagesData();
      setSelectedPage(newPage);
      setActiveTab("pages");
      alert("Custom page successfully created! Loading editor details.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleCreateQuickDraft = async () => {
    if (!quickDraftTitle.trim()) return;
    const slug = quickDraftSlug.trim() 
      ? quickDraftSlug.toLowerCase().replace(/[^a-z0-9\-_]/g, "_") 
      : quickDraftTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");

    if (pages.some(p => p.route === slug)) {
      alert("A page with this slug already exists.");
      return;
    }

    const newPage: PageData = {
      route: slug,
      title: quickDraftTitle,
      isCustom: true,
      status: "draft",
      publishedContent: { sections: [] },
      draftContent: { 
        sections: [
          {
            type: "standard_header",
            title: quickDraftTitle
          },
          {
            type: "paragraph_block",
            title: "DRAFT",
            text: "Initial quick draft contents. Open page editor to customize."
          }
        ] 
      }
    };

    try {
      await setDoc(doc(db, "pages", slug), newPage);
      setQuickDraftTitle("");
      setQuickDraftSlug("");
      await loadPagesData();
      setSelectedPage(newPage);
      setActiveTab("pages");
      alert(`Quick draft "${newPage.title}" created in workspace!`);
    } catch (e) {
      alert("Error creating quick draft: " + String(e));
    }
  };

  const addSection = (type: CmsSection["type"]) => {
    if (!selectedPage) return;
    
    let templateSection: CmsSection;
    if (type === "hero") {
      templateSection = { type: "hero", title: "NEW BANNER", buttonText: "Click Here", buttonRoute: "home", subtext: "Subheading detail information" };
    } else if (type === "image_text") {
      templateSection = { type: "image_text", title: "Heading Title", text: "Paragraph text explaining details inside.", image: "" };
    } else if (type === "video_embed") {
      templateSection = { type: "video_embed", title: "Watch Live", text: "Description of video stream.", videoUrl: "" };
    } else if (type === "standard_header") {
      templateSection = { type: "standard_header", title: "HEADER TITLE" };
    } else if (type === "text_columns") {
      templateSection = { type: "text_columns", columns: [{ subtitle: "COLUMN 1", body: "Text columns body." }] };
    } else if (type === "paragraph_block") {
      templateSection = { type: "paragraph_block", title: "TITLE", text: "Text content block details." };
    } else {
      templateSection = { type: "cards_grid", items: [{ icon: "clock", title: "ITEM TITLE", buttonText: "Click" }] };
    }

    const updatedSections = [...(selectedPage.draftContent?.sections || []), templateSection];
    const updatedPage: PageData = {
      ...selectedPage,
      draftContent: { sections: updatedSections }
    };
    setSelectedPage(updatedPage);
    setIsEditingSectionIdx(updatedSections.length - 1);
  };

  const removeSection = (idx: number) => {
    if (!selectedPage) return;
    const working = [...(selectedPage.draftContent?.sections || [])];
    working.splice(idx, 1);
    setSelectedPage({
      ...selectedPage,
      draftContent: { sections: working }
    });
    setIsEditingSectionIdx(null);
  };

  const moveSection = (idx: number, direction: "up" | "down") => {
    if (!selectedPage) return;
    const working = [...(selectedPage.draftContent?.sections || [])];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= working.length) return;
    
    const temp = working[idx];
    working[idx] = working[targetIdx];
    working[targetIdx] = temp;

    setSelectedPage({
      ...selectedPage,
      draftContent: { sections: working }
    });
    if (isEditingSectionIdx === idx) setIsEditingSectionIdx(targetIdx);
    else if (isEditingSectionIdx === targetIdx) setIsEditingSectionIdx(idx);
  };

  const togglePreviewMode = () => {
    const nextVal = !previewEnabled;
    setPreviewEnabled(nextVal);
    localStorage.setItem("cms_preview_enabled", nextVal ? "true" : "false");
  };

  const updateSectionField = (secIdx: number, fieldName: keyof CmsSection, value: any) => {
    if (!selectedPage) return;
    const nextSections = [...(selectedPage.draftContent?.sections || [])];
    nextSections[secIdx] = {
      ...nextSections[secIdx],
      [fieldName]: value
    };
    setSelectedPage({
      ...selectedPage,
      draftContent: { sections: nextSections }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center py-12" id="cms-loading">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-700 border-t-blue-500"></div>
        <p className="mt-4 text-slate-400 font-sans text-sm">Verifying administration session...</p>
      </div>
    );
  }

  // Not logged in or unauthorized representation
  if (!user || !isAdminUser) {
    return (
      <div className="min-h-screen bg-[#111118] flex flex-col justify-center items-center px-4 py-8" id="cms-unauthorized">
        <div className="bg-[#1a1a24] p-8 border border-slate-800 shadow-xl max-w-md w-full text-center">
          <div className="w-14 h-14 bg-blue-550/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-blue-500/20">
            <svg className="w-6 h-6 text-[#2271b1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold font-sans text-slate-100 tracking-tight">KCF CMS Platform</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6 font-sans leading-relaxed">
            Administrative credentials are required to modify the website contents.
          </p>

          {user && (
            <div className="bg-red-500/10 text-red-300 p-4 mb-6 text-xs border border-red-500/20 text-left rounded-md leading-relaxed">
              <span className="font-semibold block mb-1 text-sm text-red-400">Access Restricted</span>
              Your email <span className="font-mono text-white bg-red-950 px-1 py-0.5 rounded">({user.email})</span> is not authorized. Lucas needs to pre-register your Google login inside the Firebase configuration.
            </div>
          )}

          {!user ? (
            <button
              onClick={handleLogin}
              className="w-full bg-[#2271b1] hover:bg-[#135e96] text-slate-100 font-sans text-sm py-3 px-4 font-semibold tracking-wide transition-colors cursor-pointer shadow-sm rounded"
            >
              Sign In with Google Account
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-sm py-2 px-4 transition-colors cursor-pointer rounded border border-slate-700"
            >
              Switch Account / Logout
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex overflow-x-hidden antialiased" id="cms-admin-wp">
      
      {/* 1. PERSISTENT FIXED DARK LEFT SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-[#111625] text-slate-200 transition-all duration-200 border-r border-[#1e293b]/20 overflow-y-auto ${
        sidebarOpen ? "w-60 translate-x-0" : "w-16 -translate-x-full md:translate-x-0"
      }`}>
        
        {/* Brand Header */}
        <div className="h-12 flex items-center justify-between px-4 bg-[#0a0d17] border-b border-[#232d42]/20 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            {sidebarOpen && (
              <span className="font-extrabold text-xs tracking-wider text-white uppercase font-mono truncate">
                KCF Admin <span className="text-[10px] text-zinc-400 font-sans font-semibold ml-1">v2.0</span>
              </span>
            )}
          </div>
        </div>

        {/* Sidebar Navigation Link Menu */}
        <div className="flex-1 py-4 flex flex-col space-y-1 px-3">
          {sidebarOpen && (
            <span className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest block pt-1 pb-1.5 font-sans">
              Navigation
            </span>
          )}
          
          {/* Dashboard Tab */}
          <button
            onClick={() => { setActiveTab("dashboard"); setSelectedPage(null); }}
            className={`w-full flex items-center ${sidebarOpen ? "justify-start gap-2.5 px-3 py-2" : "justify-center p-2.5"} rounded-lg transition-all text-left text-xs ${
              activeTab === "dashboard" && !selectedPage
                ? "bg-white/10 text-white font-extrabold shadow-xs"
                : "text-slate-400 hover:bg-white/5 hover:text-white font-bold"
            }`}
            title="Dashboard"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="text-[11.5px] font-sans">Dashboard</span>}
          </button>

          {/* Pages Accordion Tab with Nested Vertical Lists */}
          <div className="flex flex-col">
            <button
               onClick={() => { setActiveTab("pages"); setSelectedPage(null); setPageFilter("all"); }}
               className={`w-full flex items-center ${sidebarOpen ? "justify-start gap-2.5 px-3 py-2" : "justify-center p-2.5"} rounded-lg transition-all text-left text-xs ${
                 (activeTab === "pages" || activeTab === "add_new_page") && !selectedPage && pageFilter === "all"
                   ? "bg-white/10 text-white font-extrabold shadow-xs"
                   : "text-slate-400 hover:bg-white/5 hover:text-white font-bold"
               }`}
              title="Pages"
            >
              <FileText className="w-4 h-4 shrink-0" />
              {sidebarOpen && (
                <div className="flex-1 flex justify-between items-center min-w-0">
                  <span className="text-[11.5px] font-sans truncate">Pages</span>
                  <span className="text-[10px] bg-slate-800 border border-slate-700/60 px-1.5 py-0.2 rounded font-mono text-slate-300 font-extrabold">
                    {pages.length}
                  </span>
                </div>
              )}
            </button>

            {/* Indented Sub-Navigation list */}
            {sidebarOpen && (
              <div className="pl-6 pr-1 py-1 flex flex-col space-y-1 border-l border-zinc-800 ml-4 text-[10.5px]">
                <button
                  onClick={() => { setActiveTab("pages"); setSelectedPage(null); setPageFilter("all"); }}
                  className={`text-left py-1 px-2 rounded transition-colors ${
                    activeTab === "pages" && !selectedPage && pageFilter === "all"
                      ? "text-white font-extrabold bg-[#2c3338]"
                      : "text-zinc-400 hover:text-white font-semibold"
                  }`}
                >
                  All Pages
                </button>
                <button
                  onClick={() => { setActiveTab("add_new_page"); setSelectedPage(null); }}
                  className={`text-left py-1 px-2 rounded transition-colors ${
                    activeTab === "add_new_page" && !selectedPage
                      ? "text-white font-extrabold bg-[#2c3338]"
                      : "text-zinc-400 hover:text-white font-semibold"
                  }`}
                >
                  Add New Page
                </button>
              </div>
            )}
          </div>

          {/* Media Tab */}
          <button
            onClick={() => { setActiveTab("media"); setSelectedPage(null); }}
            className={`w-full flex items-center ${sidebarOpen ? "justify-start gap-2.5 px-3 py-2" : "justify-center p-2"} rounded transition-all text-left text-xs ${
              activeTab === "media" && !selectedPage
                ? "bg-[#2271b1] text-white font-extrabold shadow-sm"
                : "text-zinc-300 hover:bg-[#2c3338] hover:text-white font-bold"
            }`}
            title="Media Library"
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            {sidebarOpen && (
              <div className="flex-1 flex justify-between items-center min-w-0">
                <span className="text-[11.5px] font-bold font-sans truncate">Media Library</span>
                <span className="text-[10px] bg-zinc-700 px-1.5 py-0.2 rounded font-mono text-zinc-100 font-black">
                  {mediaItems.length}
                </span>
              </div>
            )}
          </button>

          {/* Drafts Filter action */}
          <button
            onClick={() => { setActiveTab("pages"); setSelectedPage(null); setPageFilter("draft"); }}
            className={`w-full flex items-center ${sidebarOpen ? "justify-start gap-2.5 px-3 py-2" : "justify-center p-2"} rounded transition-all text-left text-xs ${
              activeTab === "pages" && !selectedPage && pageFilter === "draft"
                ? "bg-[#2271b1] text-white font-extrabold shadow-sm"
                : "text-zinc-300 hover:bg-[#2c3338] hover:text-white font-bold"
            }`}
            title="Drafts"
          >
            <FileEdit className="w-4 h-4 shrink-0" />
            {sidebarOpen && (
              <div className="flex-1 flex justify-between items-center min-w-0">
                <span className="text-[11.5px] font-bold font-sans truncate">Drafts</span>
                <span className="text-[10px] bg-amber-955/80 border border-amber-800 px-1.5 py-0.2 rounded font-mono text-amber-300 font-extrabold">
                  {pages.filter(p => p.status === "draft").length}
                </span>
              </div>
            )}
          </button>

          {/* Published Filter action */}
          <button
            onClick={() => { setActiveTab("pages"); setSelectedPage(null); setPageFilter("published"); }}
            className={`w-full flex items-center ${sidebarOpen ? "justify-start gap-2.5 px-3 py-2" : "justify-center p-2"} rounded transition-all text-left text-xs ${
              activeTab === "pages" && !selectedPage && pageFilter === "published"
                ? "bg-[#2271b1] text-white font-extrabold shadow-sm"
                : "text-zinc-300 hover:bg-[#2c3338] hover:text-white font-bold"
            }`}
            title="Published"
          >
            <Globe className="w-4 h-4 shrink-0" />
            {sidebarOpen && (
              <div className="flex-1 flex justify-between items-center min-w-0">
                <span className="text-[11.5px] font-bold font-sans truncate">Published</span>
                <span className="text-[10px] bg-emerald-955/80 border border-[#166534] px-1.5 py-0.2 rounded font-mono text-emerald-300 font-extrabold">
                  {pages.filter(p => p.status === "published").length}
                </span>
              </div>
            )}
          </button>

          {/* System Settings */}
          <button
            onClick={() => { setActiveTab("settings"); setSelectedPage(null); }}
            className={`w-full flex items-center ${sidebarOpen ? "justify-start gap-2.5 px-3 py-2" : "justify-center p-2"} rounded transition-all text-left text-xs ${
              activeTab === "settings" && !selectedPage
                ? "bg-[#2271b1] text-white font-extrabold shadow-sm"
                : "text-zinc-300 hover:bg-[#2c3338] hover:text-white font-bold"
            }`}
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="text-[11.5px] font-bold font-sans">Settings</span>}
          </button>

        </div>

        {/* Database attachment info */}
        <div className="p-3 bg-[#101416] border-t border-zinc-800 text-zinc-400 text-[10px] font-mono leading-relaxed">
          {sidebarOpen ? (
            <div className="space-y-0.5 truncate text-left">
              <span className="text-zinc-300 block font-bold uppercase text-[9px]">Google Cloud database</span>
              <span className="text-[#05a2f5] font-extrabold">ai-studio-8ef325f4-*</span>
            </div>
          ) : (
            <span className="text-center block text-zinc-400 font-mono font-bold">db</span>
          )}
        </div>
      </aside>

      {/* 2. MAIN APP CONTENT PANEL AREA */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-250 ${
        sidebarOpen ? "md:pl-60" : "md:pl-16"
      }`}>
        
        {/* COMPACT TOP HEADER BAR */}
        <header className="h-12 bg-white border-b border-slate-300 px-4 flex items-center justify-between shrink-0 shadow-sm z-10 sticky top-0">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-600 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded transition-colors cursor-pointer"
              title="Toggle Sidebar Layout"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Micro Breadcrumb */}
            <div className="flex items-center gap-1 text-[11px] font-sans font-bold">
              <span onClick={() => { setActiveTab("dashboard"); setSelectedPage(null); }} className="text-[#2271b1] hover:text-[#135e96] hover:underline cursor-pointer select-none">
                PORTAL
              </span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="text-slate-900 uppercase">
                {selectedPage 
                  ? `Edit: ${selectedPage.title}` 
                  : activeTab === "add_new_page"
                  ? "ADD PAGE"
                  : activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Quick Contextual Page Save Actions */}
            {selectedPage && (
              <div className="flex items-center gap-1.5 mr-2 pr-3 border-r border-slate-200">
                <button
                  onClick={() => handleSaveDraft(selectedPage)}
                  className="bg-slate-950 hover:bg-black text-white px-2.5 py-1 text-[10.5px] font-bold flex items-center gap-1 transition-all rounded shadow-xs cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={() => handlePublishLive(selectedPage)}
                  className="bg-[#2271b5] hover:bg-[#135e9c] text-white px-2.5 py-1 text-[10.5px] font-bold flex items-center gap-1 transition-all rounded shadow-xs cursor-pointer"
                >
                  <Globe className="w-3 h-3" />
                  <span>Publish</span>
                </button>
              </div>
            )}

            {/* Live Sandbox Preview mode warning switch */}
            <button
              onClick={togglePreviewMode}
              className={`px-3 py-1 text-[9.5px] font-bold rounded flex items-center gap-1.5 transition-all border tracking-wider select-none cursor-pointer ${
                previewEnabled
                  ? "bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-150"
                  : "bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${previewEnabled ? "bg-amber-600 animate-pulse" : "bg-slate-500"}`}></span>
              <span className="hidden sm:inline">DRAFT PREVIEW: {previewEnabled ? "ON" : "OFF"}</span>
            </button>

            {/* Super Admin profile credential display */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-300">
              <div className="w-7 h-7 bg-[#2271b1] border border-[#135e96] text-white font-extrabold text-[11px] uppercase rounded flex items-center justify-center font-mono shadow-xs">
                {user.email?.slice(0, 2) || "AD"}
              </div>
              <div className="hidden lg:block text-left select-none">
                <div className="text-[10px] font-extrabold text-slate-900 truncate max-w-[110px] leading-tight">{user.email}</div>
                <div className="text-[8px] text-[#135e96] font-mono font-extrabold leading-none">Super Admin</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors cursor-pointer"
                title="Sign Out Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </header>

        {previewEnabled && (
          <div className="bg-amber-50/75 border-b border-amber-200 text-amber-800 text-left px-4 py-1.5 text-[10.5px] leading-relaxed flex items-center gap-2">
            <span>⚠️</span>
            <span>
              <strong>Draft Sandbox active:</strong> Pages list shows dynamic draft layouts. Visitor components read drafts.
            </span>
          </div>
        )}

        {/* 3. CORE CONTENT VIEW */}
        <main className="flex-1 p-4 md:p-5 max-w-7xl w-full mx-auto space-y-4 overflow-y-auto">
          
          {/* Sub-View A: DASHBOARD VIEW (NOW FULLY MODULAR) */}
          {activeTab === "dashboard" && !selectedPage && (
            <DashboardView
              pages={pages}
              mediaItems={mediaItems}
              user={user}
              setActiveTab={setActiveTab}
              setSelectedPage={setSelectedPage}
              setPageFilter={setPageFilter}
              quickDraftTitle={quickDraftTitle}
              setQuickDraftTitle={setQuickDraftTitle}
              quickDraftSlug={quickDraftSlug}
              setQuickDraftSlug={setQuickDraftSlug}
              handleCreateQuickDraft={handleCreateQuickDraft}
            />
          )}

          {/* Sub-View B: PAGES TABLE INDEX (NOW FULLY MODULAR) */}
          {activeTab === "pages" && !selectedPage && (
            <PagesTableView
              pages={pages}
              pageFilter={pageFilter}
              setPageFilter={setPageFilter}
              setSelectedPage={setSelectedPage}
              handleDeletePage={handleDeletePage}
              setActiveTab={setActiveTab}
            />
          )}

          {/* Sub-View C: MULTI-COLUMN HIGH DENSITY LAYOUT SECTION EDITOR */}
          {activeTab === "pages" && selectedPage && (
            <div className="space-y-4 text-left animate-fade-in-up" id="wp-layout-editor">
              
              {/* Back to index link */}
              <div className="flex items-center justify-between pb-1">
                <button
                  onClick={() => {
                    setSelectedPage(null);
                    setIsEditingSectionIdx(null);
                  }}
                  className="text-xs text-[#2271b1] hover:text-[#135e96] font-bold flex items-center gap-1 transition-colors"
                >
                  &larr; Return to Pages List
                </button>
              </div>

              {/* Main structured split column editor panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Flow Area Canvas */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider m-0">Sections Container Canvas</h3>
                      <p className="text-[10px] text-slate-400 m-0 leading-normal">Dynamic blocks rendered inside {selectedPage.title}</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-mono font-bold px-2 py-0.5 rounded">
                      {(selectedPage.draftContent?.sections || []).length} Blocks
                    </span>
                  </div>

                  {(!selectedPage.draftContent?.sections || selectedPage.draftContent.sections.length === 0) ? (
                    <div className="bg-slate-50 border border-dashed border-slate-300 text-slate-400 py-10 px-4 rounded text-center text-xs">
                      No blocks added yet. Click one of the buttons below to begin canvas construction.
                    </div>
                  ) : (
                    <div className="space-y-2 px-0.5">
                      {selectedPage.draftContent.sections.map((section, idx) => {
                        const isEditing = isEditingSectionIdx === idx;
                        return (
                          <div key={idx} className={`border rounded overflow-hidden transition-all duration-100 ${
                            isEditing ? "border-[#2271b1] ring-1 ring-blue-500/10" : "border-slate-200"
                          }`}>
                            
                            {/* Collapse header handle */}
                            <div className="bg-slate-50 px-3 py-2 flex justify-between items-center text-xs font-sans border-b border-slate-200/60 font-medium">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-slate-300 font-bold text-[10px] select-none">#{idx + 1}</span>
                                <span className="font-bold text-slate-600 uppercase tracking-widest bg-slate-200 text-[9px] px-1.5 py-0.3 rounded shrink-0">
                                  {section.type.replace("_", " ")}
                                </span>
                                <span className="text-slate-500 italic truncate max-w-[160px] text-[11px]">
                                  &ldquo;{section.title || "Untitled Block"}&rdquo;
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => moveSection(idx, "up")}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-400 disabled:opacity-30"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === selectedPage.draftContent.sections.length - 1}
                                  onClick={() => moveSection(idx, "down")}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-400 disabled:opacity-30"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                
                                <span className="h-3 w-px bg-slate-250 mx-1"></span>

                                <button
                                  type="button"
                                  onClick={() => setIsEditingSectionIdx(isEditing ? null : idx)}
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all uppercase ${
                                    isEditing ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-705 hover:bg-slate-250"
                                  }`}
                                >
                                  {isEditing ? "Done" : "Configure"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeSection(idx)}
                                  className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Subfields editor block */}
                            {isEditing && (
                              <div className="p-4 bg-white space-y-3 text-xs font-sans border-t border-slate-100">
                                
                                {section.type !== "cards_grid" && (
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Heading Title</label>
                                    <input
                                      type="text"
                                      value={section.title || ""}
                                      onChange={(e) => updateSectionField(idx, "title", e.target.value)}
                                      className="w-full border border-slate-250 rounded p-2 text-xs font-medium focus:outline-none focus:border-[#2271b1] bg-white text-slate-800"
                                    />
                                  </div>
                                )}

                                {section.type === "hero" && (
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hero Subtext Tagline</label>
                                    <input
                                      type="text"
                                      value={section.subtext || ""}
                                      onChange={(e) => updateSectionField(idx, "subtext", e.target.value)}
                                      className="w-full border border-slate-250 rounded p-2 text-xs focus:outline-none focus:border-[#2271b1] bg-white text-slate-800"
                                    />
                                  </div>
                                )}

                                {section.type === "hero" && (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Button text</label>
                                      <input
                                        type="text"
                                        value={section.buttonText || ""}
                                        onChange={(e) => updateSectionField(idx, "buttonText", e.target.value)}
                                        className="w-full border border-slate-250 rounded p-2 text-xs bg-white text-slate-800 focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Destination Route</label>
                                      <select
                                        value={section.buttonRoute || ""}
                                        onChange={(e) => updateSectionField(idx, "buttonRoute", e.target.value)}
                                        className="w-full border border-slate-250 rounded p-2 text-xs bg-white text-slate-800 focus:outline-none"
                                      >
                                        <option value="">-- select route --</option>
                                        {Object.values(PageRoute).map(r => (
                                          <option key={r} value={r}>{r}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                )}

                                {(section.type === "image_text" || section.type === "video_embed" || section.type === "paragraph_block") && (
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Paragraph / Description prose</label>
                                    <textarea
                                      rows={3}
                                      value={section.text || ""}
                                      onChange={(e) => updateSectionField(idx, "text", e.target.value)}
                                      className="w-full border border-slate-250 rounded p-2 text-xs font-sans text-slate-800 bg-white focus:outline-none"
                                    ></textarea>
                                  </div>
                                )}

                                {section.type === "image_text" && (
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Image URL location</label>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={section.image || ""}
                                        onChange={(e) => updateSectionField(idx, "image", e.target.value)}
                                        placeholder="Img/kcf-banner.png or copy from Media link"
                                        className="flex-1 border border-slate-250 rounded p-2 text-xs bg-white focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveTab("media");
                                          setSelectedPage(null);
                                          alert("Copy any image flyer URL in the 'Media Library' tab and paste it into this input box.");
                                        }}
                                        className="bg-slate-100 border border-slate-250 hover:bg-slate-205 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-wider rounded transition-colors"
                                      >
                                        Media
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {section.type === "video_embed" && (
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">IFrame Player Video Link</label>
                                    <input
                                      type="text"
                                      value={section.videoUrl || ""}
                                      onChange={(e) => updateSectionField(idx, "videoUrl", e.target.value)}
                                      placeholder="https://subsplash.com/..."
                                      className="w-full border border-slate-250 rounded p-2 text-xs bg-white focus:outline-none"
                                    />
                                  </div>
                                )}

                                {section.type === "text_columns" && (
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-slate-50 p-2 border border-slate-200 rounded">
                                      <span className="text-[9.5px] font-bold text-slate-500 uppercase">Interactive Columns</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const cols = [...(section.columns || [])];
                                          cols.push({ subtitle: "New Column", body: "Description body." });
                                          updateSectionField(idx, "columns", cols);
                                        }}
                                        className="bg-[#2271b1] hover:bg-[#135e96] font-bold text-white text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded"
                                      >
                                        + Column
                                      </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {(section.columns || []).map((col, colIdx) => (
                                        <div key={colIdx} className="bg-slate-55/40 p-2.5 border border-slate-200 rounded space-y-1.5">
                                          <div className="flex justify-between items-center text-[9px] text-slate-400">
                                            <span>Column #{colIdx + 1}</span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const cols = [...(section.columns || [])];
                                                cols.splice(colIdx, 1);
                                                updateSectionField(idx, "columns", cols);
                                              }}
                                              className="text-red-500 hover:underline font-bold"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                          <input
                                            type="text"
                                            value={col.subtitle}
                                            placeholder="Column Title"
                                            onChange={(e) => {
                                              const cols = [...(section.columns || [])];
                                              cols[colIdx] = { ...cols[colIdx], subtitle: e.target.value };
                                              updateSectionField(idx, "columns", cols);
                                            }}
                                            className="w-full border border-slate-200 rounded p-1 text-xs font-semibold focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={col.body}
                                            onChange={(e) => {
                                              const cols = [...(section.columns || [])];
                                              cols[colIdx] = { ...cols[colIdx], body: e.target.value };
                                              updateSectionField(idx, "columns", cols);
                                            }}
                                            className="w-full border border-slate-200 text-xs font-sans rounded p-1 focus:outline-none"
                                          ></textarea>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {section.type === "cards_grid" && (
                                  <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-slate-50 p-2 border border-slate-200 rounded">
                                      <span className="text-[9.5px] font-bold text-slate-500 uppercase">Card Items</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const items = [...(section.items || [])];
                                          items.push({ icon: "clock", title: "NEW CARD", buttonText: "Learn More", route: "home" });
                                          updateSectionField(idx, "items", items);
                                        }}
                                        className="bg-[#2271b1] hover:bg-[#135e96] font-bold text-white text-[9.5px] uppercase px-2 py-0.5 rounded"
                                      >
                                        + Card
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {(section.items || []).map((item, itemIdx) => (
                                        <div key={itemIdx} className="bg-slate-55/40 p-3 border border-slate-200 rounded space-y-2 relative">
                                          <div className="flex justify-between items-center text-[9px] text-slate-400">
                                            <span>Card Row #{itemIdx + 1}</span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const items = [...(section.items || [])];
                                                items.splice(itemIdx, 1);
                                                updateSectionField(idx, "items", items);
                                              }}
                                              className="text-red-500 hover:underline font-bold"
                                            >
                                              Delete
                                            </button>
                                          </div>

                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-[9px] font-medium text-slate-550 mb-0.5">Card Title</label>
                                              <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => {
                                                  const items = [...(section.items || [])];
                                                  items[itemIdx] = { ...items[itemIdx], title: e.target.value };
                                                  updateSectionField(idx, "items", items);
                                                }}
                                                className="w-full border border-slate-200 rounded p-1 text-xs"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[9px] font-medium text-slate-550 mb-0.5">Vector Icon</label>
                                              <select
                                                value={item.icon}
                                                onChange={(e) => {
                                                  const items = [...(section.items || [])];
                                                  items[itemIdx] = { ...items[itemIdx], icon: e.target.value };
                                                  updateSectionField(idx, "items", items);
                                                }}
                                                className="w-full border border-slate-200 rounded p-1 text-xs bg-white"
                                              >
                                                <option value="clock">Clock Outline icon</option>
                                                <option value="calendar">Calendar Dates icon</option>
                                                <option value="edit">Pen & Paper form icon</option>
                                              </select>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-[9px] font-medium text-slate-550 mb-0.5">CTA text</label>
                                              <input
                                                type="text"
                                                value={item.buttonText}
                                                onChange={(e) => {
                                                  const items = [...(section.items || [])];
                                                  items[itemIdx] = { ...items[itemIdx], buttonText: e.target.value };
                                                  updateSectionField(idx, "items", items);
                                                }}
                                                className="w-full border border-slate-200 rounded p-1 text-xs"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[9px] font-medium text-slate-550 mb-0.5">Internal Path</label>
                                              <select
                                                value={item.route || ""}
                                                onChange={(e) => {
                                                  const items = [...(section.items || [])];
                                                  items[itemIdx] = { ...items[itemIdx], route: e.target.value || undefined, externalUrl: undefined };
                                                  updateSectionField(idx, "items", items);
                                                }}
                                                className="w-full border border-slate-200 rounded p-1 text-xs bg-white"
                                              >
                                                <option value="">-- External URL link --</option>
                                                {Object.values(PageRoute).map(r => (
                                                  <option key={r} value={r}>{r}</option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>

                                          {!item.route && (
                                            <div>
                                              <label className="block text-[9px] font-medium text-slate-550 mb-0.5">External URL Path</label>
                                              <input
                                                type="text"
                                                value={item.externalUrl || ""}
                                                placeholder="https://share.fluro.io/..."
                                                onChange={(e) => {
                                                  const items = [...(section.items || [])];
                                                  items[itemIdx] = { ...items[itemIdx], externalUrl: e.target.value };
                                                  updateSectionField(idx, "items", items);
                                                }}
                                                className="w-full border border-slate-200 rounded p-1 text-xs"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* APPEND BUTTON GROUP */}
                  <div className="border-t border-slate-100 pt-3.5 text-left font-sans text-xs">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Append Layout Block</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => addSection("hero")}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 rounded font-bold uppercase text-[9.5px] transition-all cursor-pointer"
                      >
                        + Hero Welcome header
                      </button>
                      <button
                        onClick={() => addSection("standard_header")}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 rounded font-bold uppercase text-[9.5px] transition-all cursor-pointer"
                      >
                        + Block Header Title
                      </button>
                      <button
                        onClick={() => addSection("image_text")}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 rounded font-bold uppercase text-[9.5px] transition-all cursor-pointer"
                      >
                        + Image with Prose
                      </button>
                      <button
                        onClick={() => addSection("video_embed")}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 rounded font-bold uppercase text-[9.5px] transition-all cursor-pointer"
                      >
                        + Video Embed Player
                      </button>
                      <button
                        onClick={() => addSection("text_columns")}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 rounded font-bold uppercase text-[9.5px] transition-all cursor-pointer"
                      >
                        + Multi-column custom blocks
                      </button>
                      <button
                        onClick={() => addSection("paragraph_block")}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 rounded font-bold uppercase text-[9.5px] transition-all cursor-pointer"
                      >
                        + Normal Paragraph
                      </button>
                      <button
                        onClick={() => addSection("cards_grid")}
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white py-1.5 rounded font-bold uppercase text-[9.5px] transition-all cursor-pointer col-span-2"
                      >
                        + Add Interactive Card Grid Builder
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Column Widget */}
                <div className="lg:col-span-4 space-y-4">
                  
                  <div className="bg-white border border-slate-200 rounded p-4 space-y-3.5 shadow-2xs">
                    <h3 className="text-xs font-bold text-slate-800 uppercase border-b border-slate-100 pb-2 m-0 font-sans">Publish Attributes</h3>
                    
                    <div className="text-xs space-y-2.5 font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Current Status:</span>
                        <span className={`font-bold uppercase text-[9px] px-2 py-0.5 border rounded ${selectedPage.status === "published" ? "bg-green-50 border-green-200 text-green-700 font-semibold" : "bg-amber-50 border-amber-200 text-amber-700 font-semibold"}`}>
                          {selectedPage.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Slug path:</span>
                        <span className="font-bold font-mono text-slate-700">/{selectedPage.route}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                      <button
                        onClick={() => handleSaveDraft(selectedPage)}
                        className="bg-slate-900 text-white font-semibold hover:bg-black py-1.5 rounded transition-all text-[10.5px] uppercase"
                      >
                        Save Draft
                      </button>
                      <button
                        onClick={() => handlePublishLive(selectedPage)}
                        className="bg-[#2271b1] hover:bg-[#135e96] text-white py-1.5 rounded font-semibold transition-all text-[10.5px] uppercase"
                      >
                        Publish Live
                      </button>
                    </div>
                  </div>

                  {/* Sandbox info */}
                  <div className="bg-white border border-slate-200 rounded p-4 text-xs space-y-1.5">
                    <span className="font-bold text-slate-800 font-sans block text-left">Emulate Changes Instantly</span>
                    <p className="text-slate-500 text-[10.5px] m-0 text-left leading-normal">
                      Enable the header draft sandbox preview, and visitors loading this URL will view the saved drafts instantly!
                    </p>
                  </div>

                  {selectedPage.isCustom && (
                    <div className="bg-red-50/50 border border-red-200 rounded p-4 text-left space-y-2.5">
                      <h4 className="text-xs font-bold text-red-700 uppercase m-0 leading-none">Danger Zone</h4>
                      <p className="text-[10px] text-red-650 leading-normal m-0 font-sans">
                        Removing this page template deletes all sections. This is irreversible.
                      </p>
                      
                      <button
                        onClick={() => handleDeletePage(selectedPage.route)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase py-1.5 rounded transition-all w-full cursor-pointer leading-tight shadow-2xs"
                      >
                        Discard Layout
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* Sub-View D: MEDIA VIEW (NOW FULLY MODULAR) */}
          {activeTab === "media" && !selectedPage && (
            <MediaLibraryView
              mediaItems={mediaItems}
              uploadingImage={uploadingImage}
              dragActive={dragActive}
              fileInputRef={fileInputRef}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              handleFileSelect={handleFileSelect}
              loadMediaItems={loadMediaItems}
              handleFirestoreError={handleFirestoreError}
            />
          )}

          {/* Sub-View E: SECURE FIREBASE SYSTEM INFORMATION (NOW FULLY MODULAR) */}
          {activeTab === "settings" && !selectedPage && (
            <SettingsView user={user} />
          )}

          {/* Sub-View F: DEDICATED INLINE "ADD NEW PAGE" VIEW (NO MODAL) */}
          {activeTab === "add_new_page" && !selectedPage && (
            <div className="space-y-4 text-left max-w-xl mx-auto animate-fade-in-up" id="wp-add-page-form">
              
              <div className="border-b border-slate-200 pb-2.5">
                <h2 className="text-base font-bold text-slate-800 m-0 font-sans tracking-tight leading-none">
                  Add New Custom Page
                </h2>
                <p className="text-[11px] text-slate-450 mt-1 m-0">Provision and model a brand new dynamic landing page with modular rows.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded p-4 space-y-4 shadow-2xs">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Page Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Nursery Services"
                    value={newPageTitle}
                    onChange={(e) => {
                      setNewPageTitle(e.target.value);
                      if (!newPageSlug) {
                        setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "_"));
                      }
                    }}
                    className="w-full border border-slate-250 rounded p-2.5 text-xs text-slate-800 bg-white font-medium focus:ring-1 focus:ring-blue-500/20 focus:border-[#2271b1] focus:outline-none transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Defines the primary banner, navigation tag, and main header of the custom path page.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-705 mb-1.5">Dynamic Web Path Slug</label>
                  <div className="flex">
                    <span className="bg-slate-100 p-2 border border-slate-250 border-r-0 rounded-l text-xs font-mono text-slate-400 select-none flex items-center">
                      /
                    </span>
                    <input
                      type="text"
                      placeholder="nursery"
                      value={newPageSlug}
                      onChange={(e) => setNewPageSlug(e.target.value)}
                      className="flex-1 border border-slate-250 p-2.5 text-xs font-mono rounded-r focus:ring-1 focus:ring-blue-500/20 focus:border-[#2271b1] focus:outline-none transition-all bg-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Lowercase letters, numbers and underscores only (e.g. Nursery). Routes map directly to this address.
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPageTitle("");
                      setNewPageSlug("");
                      setActiveTab("pages");
                    }}
                    className="bg-white hover:bg-slate-100 border border-slate-350 px-3 py-1.5 rounded font-bold text-slate-650 text-[10.5px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!newPageTitle.trim() || !newPageSlug.trim()}
                    onClick={createNewCustomPage}
                    className="bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-40 text-white px-4 py-1.5 rounded font-bold transition-all shadow-xs cursor-pointer text-[10.5px] uppercase"
                  >
                    Save as Page draft
                  </button>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};
