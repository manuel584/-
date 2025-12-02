
import React, { useState, useRef } from 'react';
import { GlassCard, Button, Input, Modal, StatusBadge } from '../../components/UI';
import { MOCK_DOCUMENTS } from '../../constants';
import { Folder, Plus, ArrowLeft, FileText, Image as ImageIcon, Calendar, Download, MoreVertical, X, UploadCloud, Eye, Trash2, CheckSquare, Square, CheckCircle2 } from 'lucide-react';
import { DocumentFile } from '../../types';
import { cn } from '../../utils';
import { useReminders } from '../../context/ReminderContext';

export const DocumentSection = () => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const { addReminder } = useReminders();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for data to allow simulation of adding items
  const [folders, setFolders] = useState(['Licenses', 'Contracts', 'Receipts', 'Identity', 'Vehicle', 'Property']);
  const [documents, setDocuments] = useState<DocumentFile[]>(MOCK_DOCUMENTS);

  // Modal States
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  // Upload State
  const [selectedFiles, setSelectedFiles] = useState<{id: string, name: string, size: string}[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Bulk Selection State
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  // Form States
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');
  
  // Filter docs if folder selected
  const docs = currentFolder 
    ? documents.filter(d => d.folder === currentFolder)
    : [];

  const handleFolderClick = (folder: string) => {
    setCurrentFolder(folder);
    setSelectedDocs(new Set());
  };

  const handleBack = () => {
    setCurrentFolder(null);
    setSelectedDocs(new Set());
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      setError('Folder name is required');
      return;
    }
    
    setFolders([...folders, newFolderName.trim()]);
    setNewFolderName('');
    setIsAddFolderOpen(false);
    setError('');
  };

  const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelect = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const newFiles = Array.from(e.target.files).map((file: File) => ({
              id: `f${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: file.name,
              size: formatFileSize(file.size)
          }));
          setSelectedFiles(prev => [...prev, ...newFiles]);
          setUploadError('');
      }
      // Reset input value to allow selecting the same file again if needed
      if (e.target) e.target.value = '';
  };

  const removeSelectedFile = (id: string) => {
      setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
        setUploadError('Please select files to upload');
        return;
    }

    if (!currentFolder) return;

    setIsUploading(true);
    const initialProgress: Record<string, number> = {};
    selectedFiles.forEach(f => initialProgress[f.id] = 0);
    setUploadProgress(initialProgress);

    const uploadPromises = selectedFiles.map(file => {
        return new Promise<void>((resolve) => {
            let progress = 0;
            const speed = Math.floor(Math.random() * 10) + 5; // Random speed for realism
            
            const interval = setInterval(() => {
                progress = Math.min(progress + speed, 100);
                setUploadProgress(prev => ({
                    ...prev,
                    [file.id]: progress
                }));

                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 200);
        });
    });

    await Promise.all(uploadPromises);

    // Create new documents
    const newDocs: DocumentFile[] = selectedFiles.map(f => ({
        id: `d${Date.now()}_${f.id}`,
        name: f.name,
        type: f.name.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'pdf', // Simple type check
        size: f.size,
        date: new Date().toISOString().split('T')[0],
        folder: currentFolder
    }));

    setTimeout(() => {
        setDocuments([...newDocs, ...documents]);
        setIsUploadOpen(false);
        setIsUploading(false);
        setUploadProgress({});
        setSelectedFiles([]);
    }, 500); // Small delay to show 100% complete
  };

  const toggleSelectDoc = (id: string) => {
      const newSelected = new Set(selectedDocs);
      if (newSelected.has(id)) {
          newSelected.delete(id);
      } else {
          newSelected.add(id);
      }
      setSelectedDocs(newSelected);
  };

  const handleDelete = (id: string) => {
      if (confirm("Delete this document?")) {
          setDocuments(documents.filter(d => d.id !== id));
          if (selectedDocs.has(id)) {
             const newSelected = new Set(selectedDocs);
             newSelected.delete(id);
             setSelectedDocs(newSelected);
          }
      }
  };

  const handleBulkDelete = () => {
      if (confirm(`Are you sure you want to delete ${selectedDocs.size} documents?`)) {
          setDocuments(documents.filter(d => !selectedDocs.has(d.id)));
          setSelectedDocs(new Set());
      }
  };

  const handleSetExpiryReminder = (doc: DocumentFile) => {
      if (!doc.expiryDate) return;
      
      const expiry = new Date(doc.expiryDate);
      const reminderDate = new Date(expiry);
      reminderDate.setDate(expiry.getDate() - 7);
      
      const dateStr = reminderDate.toISOString().split('T')[0];
      
      if (confirm(`Set a reminder for "${doc.name}" on ${dateStr} (7 days before expiry)?`)) {
          addReminder({
              title: `Renew: ${doc.name}`,
              dueDate: dateStr,
              dueTime: '09:00',
              priority: 'High',
              description: `Document expires on ${doc.expiryDate}`
          });
          alert("Reminder set successfully!");
      }
  };

  const resetUploadModal = () => {
      setIsUploadOpen(false); 
      setUploadProgress({}); 
      setSelectedFiles([]); 
      setUploadError('');
      setIsUploading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-3 min-w-0">
           {currentFolder && (
             <button onClick={handleBack} className="p-1.5 hover:bg-white/50 rounded-full transition-colors text-gray-500 shrink-0">
               <ArrowLeft size={20} />
             </button>
           )}
           <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">{currentFolder || 'Documents'}</h2>
              <p className="text-xs text-gray-500 truncate">{currentFolder ? `${docs.length} files found` : 'Organized secure storage'}</p>
           </div>
        </div>
        <div className="flex gap-2 shrink-0">
            {selectedDocs.size > 0 && (
                <Button variant="danger" className="text-xs px-2 sm:px-3" onClick={handleBulkDelete}>
                    <Trash2 size={14} className="mr-1" /> 
                    <span className="hidden sm:inline">Delete</span> 
                    <span className="ml-1">({selectedDocs.size})</span>
                </Button>
            )}
            <Button 
            className="text-xs px-2 sm:px-3" 
            onClick={() => currentFolder ? setIsUploadOpen(true) : setIsAddFolderOpen(true)}
            >
            <Plus size={14} className="mr-1" /> 
            <span className="hidden sm:inline">{currentFolder ? 'Upload File' : 'Add Folder'}</span>
            <span className="sm:hidden">{currentFolder ? 'Upload' : 'Add'}</span>
            </Button>
        </div>
      </div>

      {/* Grid View (Folders) */}
      {!currentFolder && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {folders.map((folder) => (
             <GlassCard 
                key={folder} 
                onClick={() => handleFolderClick(folder)} 
                className="flex flex-col items-center justify-center py-8 gap-3 hover:bg-white/80 cursor-pointer group transition-all duration-300 active:scale-95"
             >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform relative">
                   <Folder size={32} fill="currentColor" className="opacity-20 text-blue-500" />
                   <Folder size={24} className="absolute" />
                </div>
                <span className="font-medium text-gray-700 text-center truncate w-full px-2">{folder}</span>
                <span className="text-xs text-gray-400 bg-white/50 px-2 py-0.5 rounded-full border border-gray-100">
                   {documents.filter(d => d.folder === folder).length} items
                </span>
             </GlassCard>
          ))}
        </div>
      )}

      {/* List View (Files) */}
      {currentFolder && (
        <div className="space-y-3">
           {docs.length === 0 ? (
             <div className="text-center py-12 text-gray-400">
               <Folder size={48} className="mx-auto mb-3 opacity-20" />
               <p>No documents in this folder yet.</p>
               <Button variant="secondary" className="mt-4" onClick={() => setIsUploadOpen(true)}>
                 Upload First Document
               </Button>
             </div>
           ) : (
             docs.map(doc => (
               <GlassCard 
                key={doc.id} 
                onClick={() => setPreviewDoc(doc)}
                className={cn(
                    "flex items-center justify-between p-3 group cursor-pointer transition-all",
                    selectedDocs.has(doc.id) ? "bg-blue-50 border-blue-200" : "hover:bg-white/90"
                )}
               >
                 <div className="flex items-center gap-3 min-w-0">
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleSelectDoc(doc.id); }}
                        className={cn("text-gray-400 hover:text-blue-500 shrink-0", selectedDocs.has(doc.id) && "text-blue-600")}
                    >
                        {selectedDocs.has(doc.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                    </button>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                       {doc.type === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
                    </div>
                    <div className="min-w-0">
                       <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{doc.name}</h4>
                       <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span>{doc.size}</span>
                          {doc.expiryDate && (
                            <span className={`flex items-center gap-1 ${new Date(doc.expiryDate) < new Date('2024-06-01') ? 'text-red-500 font-medium' : ''}`}>
                               <Calendar size={10} /> <span className="hidden sm:inline">Exp:</span> {doc.expiryDate}
                            </span>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-1 shrink-0">
                    {doc.expiryDate && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleSetExpiryReminder(doc); }}
                            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                            title="Set Reminder"
                        >
                            <Calendar size={18} />
                        </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                       <Trash2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* download logic */ }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                       <Download size={18} />
                    </button>
                 </div>
               </GlassCard>
             ))
           )}
        </div>
      )}

      {/* 1. Add Folder Modal */}
      <Modal isOpen={isAddFolderOpen} onClose={() => setIsAddFolderOpen(false)} title="Create New Folder">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
            <Input 
              value={newFolderName}
              onChange={(e) => {
                 setNewFolderName(e.target.value);
                 setError('');
              }}
              placeholder="e.g. Tax Returns" 
              autoFocus 
              error={error}
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
             New folders will be synced to your cloud storage automatically.
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsAddFolderOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreateFolder}>Create Folder</Button>
          </div>
        </div>
      </Modal>

      {/* 2. Upload Document Modal */}
      <Modal isOpen={isUploadOpen} onClose={resetUploadModal} title="Upload Documents">
        <div className="space-y-4">
          <div 
            className={cn(
                "border-2 border-dashed rounded-xl p-6 flex flex-col items-center text-center transition-all",
                uploadError ? "border-red-300 bg-red-50" : "border-gray-300 hover:bg-gray-50",
                !isUploading ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            )} 
            onClick={() => !isUploading && handleFileSelect()}
          >
             <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
                multiple
                style={{ display: 'none' }}
             />
             <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-2", uploadError ? "bg-red-100 text-red-500" : "bg-blue-50 text-blue-500")}>
                <UploadCloud size={24} />
             </div>
             <p className="font-medium text-gray-900">Click to Select Files</p>
             <p className="text-xs text-gray-500 mt-1">Select multiple files from your device</p>
          </div>
          
          {uploadError && (
              <p className="text-xs text-red-500 text-center font-medium animate-in slide-in-from-top-1">{uploadError}</p>
          )}

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <p className="text-xs font-bold text-gray-500 uppercase">Selected Files ({selectedFiles.length})</p>
                  {selectedFiles.map(file => (
                      <div key={file.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText size={16} className="text-blue-500 shrink-0" />
                                  <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                              </div>
                              {isUploading ? (
                                  <span className="text-xs font-medium text-blue-600">{uploadProgress[file.id] || 0}%</span>
                              ) : (
                                  <button onClick={() => removeSelectedFile(file.id)} className="text-gray-400 hover:text-red-500">
                                      <X size={16} />
                                  </button>
                              )}
                          </div>
                          
                          {/* Progress Bar */}
                          {isUploading && (
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                                  <div 
                                    className="h-full bg-blue-500 transition-all duration-200" 
                                    style={{ width: `${uploadProgress[file.id] || 0}%` }} 
                                  />
                              </div>
                          )}
                          {!isUploading && (
                              <p className="text-xs text-gray-400 pl-6">{file.size}</p>
                          )}
                      </div>
                  ))}
              </div>
          )}

          <div className="flex gap-3 pt-2">
             <Button variant="secondary" className="flex-1" onClick={resetUploadModal} disabled={isUploading}>Cancel</Button>
             <Button className="flex-1" onClick={handleUpload} disabled={isUploading || selectedFiles.length === 0}>
                 {isUploading ? 'Uploading...' : 'Upload All'}
             </Button>
          </div>
        </div>
      </Modal>

      {/* 3. Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setPreviewDoc(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Preview Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded flex items-center justify-center ${previewDoc.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                   {previewDoc.type === 'pdf' ? <FileText size={16} /> : <ImageIcon size={16} />}
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 text-sm">{previewDoc.name}</h3>
                   <p className="text-xs text-gray-500">{previewDoc.size} • {previewDoc.date}</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                    <Download size={18} />
                 </button>
                 <button onClick={() => setPreviewDoc(null)} className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg text-gray-400 transition-colors">
                    <X size={18} />
                 </button>
               </div>
            </div>

            {/* Preview Body (Placeholder) */}
            <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center min-h-[300px] overflow-auto">
               <div className="bg-white shadow-lg p-12 rounded-lg text-center max-w-sm">
                  {previewDoc.type === 'pdf' ? (
                    <FileText size={64} className="text-gray-300 mx-auto mb-4" />
                  ) : (
                    <ImageIcon size={64} className="text-gray-300 mx-auto mb-4" />
                  )}
                  <p className="text-gray-500 font-medium">Document Preview</p>
                  <p className="text-xs text-gray-400 mt-2">
                    This is a mock preview for <br/> <span className="text-gray-600 font-mono">{previewDoc.name}</span>
                  </p>
                  <Button className="mt-6 w-full" variant="secondary">
                     Open in new tab
                  </Button>
               </div>
            </div>
            
            {/* Preview Footer */}
            {previewDoc.expiryDate && (
               <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-100 flex justify-between items-center">
                  <span className="text-xs text-yellow-800 flex items-center gap-2">
                     <Calendar size={14} /> 
                     Expires on <strong>{previewDoc.expiryDate}</strong>
                  </span>
                  <button onClick={() => handleSetExpiryReminder(previewDoc)} className="text-xs font-medium text-yellow-800 hover:underline">Renew Document</button>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
