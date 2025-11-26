
import React, { useState } from 'react';
import { GlassCard, Button, Input, Modal, StatusBadge } from '../../components/UI';
import { MOCK_DOCUMENTS } from '../../constants';
import { Folder, Plus, ArrowLeft, FileText, Image as ImageIcon, Calendar, Download, MoreVertical, X, UploadCloud, Eye } from 'lucide-react';
import { DocumentFile } from '../../types';

export const DocumentSection = () => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  
  // State for data to allow simulation of adding items
  const [folders, setFolders] = useState(['Licenses', 'Contracts', 'Receipts', 'Identity', 'Vehicle', 'Property']);
  const [documents, setDocuments] = useState<DocumentFile[]>(MOCK_DOCUMENTS);

  // Modal States
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  // Form States
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');
  
  // Filter docs if folder selected
  const docs = currentFolder 
    ? documents.filter(d => d.folder === currentFolder)
    : [];

  const handleFolderClick = (folder: string) => {
    setCurrentFolder(folder);
  };

  const handleBack = () => {
    setCurrentFolder(null);
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

  const handleUpload = () => {
    // Simulate upload
    if (currentFolder) {
      const newDoc: DocumentFile = {
        id: `d${Date.now()}`,
        name: `New Upload ${docs.length + 1}.pdf`,
        type: 'pdf',
        size: '1.2 MB',
        date: new Date().toISOString().split('T')[0],
        folder: currentFolder
      };
      setDocuments([newDoc, ...documents]);
      setIsUploadOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           {currentFolder && (
             <button onClick={handleBack} className="p-1.5 hover:bg-white/50 rounded-full transition-colors text-gray-500">
               <ArrowLeft size={20} />
             </button>
           )}
           <div>
              <h2 className="text-xl font-bold text-gray-900">{currentFolder || 'Documents'}</h2>
              <p className="text-xs text-gray-500">{currentFolder ? `${docs.length} files found` : 'Organized secure storage'}</p>
           </div>
        </div>
        <Button 
          className="text-xs" 
          onClick={() => currentFolder ? setIsUploadOpen(true) : setIsAddFolderOpen(true)}
        >
          <Plus size={14} className="mr-1" /> {currentFolder ? 'Upload File' : 'Add Folder'}
        </Button>
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
                <span className="font-medium text-gray-700">{folder}</span>
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
                className="flex items-center justify-between p-3 group cursor-pointer hover:bg-white/90 transition-all"
               >
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                       {doc.type === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
                    </div>
                    <div>
                       <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{doc.name}</h4>
                       <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span>{doc.size}</span>
                          {doc.expiryDate && (
                            <span className={`flex items-center gap-1 ${new Date(doc.expiryDate) < new Date('2024-06-01') ? 'text-red-500 font-medium' : ''}`}>
                               <Calendar size={10} /> Exp: {doc.expiryDate}
                            </span>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-1">
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
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Document">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleUpload}>
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3">
               <UploadCloud size={24} />
             </div>
             <p className="font-medium text-gray-900">Click to upload</p>
             <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
          </div>
          <div className="flex gap-3 pt-2">
             <Button variant="secondary" className="flex-1" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
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
                  <button className="text-xs font-medium text-yellow-800 hover:underline">Renew Document</button>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};