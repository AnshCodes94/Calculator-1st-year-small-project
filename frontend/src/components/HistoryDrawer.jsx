import React from 'react';
import { HistoryIcon, CloseIcon, ClearIcon } from './icons';

export const HistoryDrawer = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40"
      />

      {/* Slide-out Drawer Panel */}
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-theme-surface border-l border-theme-border shadow-card flex flex-col transition-transform duration-200"
        role="dialog"
        aria-label="Calculation History"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-theme-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HistoryIcon size={18} className="text-theme-secondary" />
            <div>
              <h2 className="font-sans font-semibold text-sm text-theme-text">History</h2>
              <p className="text-[11px] text-theme-muted font-mono">{history.length} calculations saved</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-md text-theme-muted hover:text-theme-error hover:bg-theme-hover text-xs font-mono transition-colors"
                title="Clear all history"
              >
                <ClearIcon size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-theme-muted hover:text-theme-text hover:bg-theme-hover transition-colors"
              aria-label="Close History Drawer"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-theme-muted">
              <HistoryIcon size={32} className="opacity-30 mb-2" />
              <p className="font-medium text-xs">No calculations yet</p>
              <p className="text-[11px] text-theme-muted mt-0.5">
                Calculations will appear here.
              </p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                className="p-2.5 rounded-md bg-theme-elevated hover:bg-theme-elevated-hover border border-theme-border cursor-pointer transition-colors flex flex-col gap-1 text-left"
              >
                <div className="flex items-center justify-between text-xs text-theme-secondary font-mono">
                  <span className="truncate max-w-[200px]">
                    {item.expression}
                  </span>
                  <span className="text-[10px] text-theme-muted shrink-0">
                    {item.time || ''}
                  </span>
                </div>

                <div className="text-right font-mono font-medium text-theme-text text-sm">
                  {item.numeric || item.latex || item.exact}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-theme-border text-center text-[11px] text-theme-muted font-mono">
          Click any calculation to recall.
        </div>
      </aside>
    </>
  );
};
