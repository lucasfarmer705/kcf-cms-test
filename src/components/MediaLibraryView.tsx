import React, { useState } from "react";
import { Upload, Copy, Trash2, Check } from "lucide-react";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";

interface MediaLibraryViewProps {
  mediaItems: any[];
  uploadingImage: boolean;
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadMediaItems: () => Promise<void>;
  handleFirestoreError: (error: unknown, op: any, path: string) => void;
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
  mediaItems,
  uploadingImage,
  dragActive,
  fileInputRef,
  handleDrag,
  handleDrop,
  handleFileSelect,
  loadMediaItems,
  handleFirestoreError
}) => {
  // Stateful feedback to prevent iframe blocking with alerts or confirms
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-4 text-left animate-fade-in-up" id="wp-media-library-view">
      
      {/* Title block */}
      <div className="border-b border-slate-300 pb-2.5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 m-0 font-sans tracking-tight leading-none">
            Media Library
          </h2>
          <p className="text-xs text-slate-705 mt-1 m-0 font-sans font-semibold">
            Persistent cloud directory for church dynamic graphics and event flyers.
          </p>
        </div>
        <span className="text-[11px] text-[#135e96] font-mono font-bold uppercase tracking-wider">Media Upload</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Squeezed Drop Zone */}
        <div className="lg:col-span-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 border-2 border-dashed rounded font-sans cursor-pointer text-center transition-all flex flex-col justify-center items-center h-full min-h-[180px] ${
              dragActive 
                ? "bg-blue-100 border-[#2271b1] text-[#135e96]" 
                : "bg-white border-slate-350 hover:bg-slate-50/70 hover:border-slate-450 shadow-sm"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className={`w-9 h-9 mb-2 transition-all ${uploadingImage ? "animate-bounce text-blue-600" : "text-slate-600 group-hover:text-slate-800"}`} />
            
            <span className="text-xs font-black text-slate-900 tracking-tight block">
              {uploadingImage ? "Uploading Asset..." : "Upload Image Asset"}
            </span>
            <span className="text-[11px] text-slate-700 mt-1.5 block font-mono font-bold">
              Drag file here or click to browse.
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Media Cards catalog */}
        <div className="lg:col-span-8 bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Files Index <span className="text-[#135e96] font-mono font-bold">({mediaItems.length})</span>
            </span>
            <span className="text-[10px] text-slate-700 font-sans font-bold">Click file icons to copy</span>
          </div>

          {mediaItems.length === 0 ? (
            <p className="text-xs text-slate-600 py-12 text-center font-bold font-sans">
              No files archived yet. Drag and upload a church poster or banner above.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 max-h-[400px] overflow-y-auto pr-1">
              {mediaItems.map((item) => {
                const isCopied = copiedId === item.id;
                const isConfirming = confirmDeleteId === item.id;

                return (
                  <div 
                    key={item.id} 
                    className="group relative border border-slate-300 bg-slate-100 p-1.5 flex flex-col justify-between rounded hover:border-slate-450 transition-colors"
                  >
                    <div className="aspect-square bg-white border border-slate-200 overflow-hidden relative flex items-center justify-center rounded-sm">
                      <img 
                        src={item.url} 
                        alt={item.fileName} 
                        className="max-h-full max-w-full object-contain" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {isCopied && (
                        <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-3xs flex flex-col items-center justify-center text-center p-1">
                          <Check className="w-5 h-5 text-emerald-400 mb-0.5" />
                          <span className="text-[8.5px] text-emerald-300 font-extrabold uppercase tracking-wider">Copied URL</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Media Actions metadata stack */}
                    <div className="mt-1.5 space-y-1">
                      <span className="text-[10px] text-slate-900 font-bold truncate block font-sans" title={item.fileName}>
                        {item.fileName}
                      </span>
                      
                      <div className="flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            setCopiedId(item.id);
                            setTimeout(() => setCopiedId(null), 1800);
                          }}
                          className="flex-1 bg-white hover:bg-blue-50 border border-slate-305 p-1 rounded text-slate-800 hover:text-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                          title="Copy file url"
                        >
                          <Copy className="w-2.5 h-2.5" />
                          <span className="text-[8.5px] font-extrabold">URL</span>
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            if (!isConfirming) {
                              setConfirmDeleteId(item.id);
                              // Auto-revert click to confirm State after 4 seconds
                              setTimeout(() => setConfirmDeleteId(null), 4000);
                              return;
                            }
                            
                            const path = `images/${item.id}`;
                            try {
                              setConfirmDeleteId(null);
                              await deleteDoc(doc(db, "images", item.id));
                              await loadMediaItems();
                            } catch (err) {
                              handleFirestoreError(err, "delete", path);
                            }
                          }}
                          className={`p-1 rounded border transition-all cursor-pointer flex items-center justify-center ${
                            isConfirming 
                              ? "bg-red-700 border-red-800 text-white animate-pulse px-2" 
                              : "bg-red-50 hover:bg-red-100 border-red-300 text-red-700 hover:text-red-900 shadow-2xs"
                          }`}
                          title={isConfirming ? "Click again to delete forever" : "Delete asset"}
                        >
                          {isConfirming ? (
                            <span className="text-[8.5px] font-extrabold">CONFIRM?</span>
                          ) : (
                            <Trash2 className="w-2.5 h-2.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
