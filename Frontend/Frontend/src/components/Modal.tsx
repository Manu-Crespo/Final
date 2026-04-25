import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-surface border border-border p-6 rounded-default w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <button className="text-text-muted hover:text-white text-2xl transition-colors" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
