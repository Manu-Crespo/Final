import React from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<Props> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[2000] backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="bg-surface border border-border p-8 rounded-default max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-text-muted mb-8 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-4 justify-center">
          <button className="btn btn-outline flex-1" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger flex-1" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};
