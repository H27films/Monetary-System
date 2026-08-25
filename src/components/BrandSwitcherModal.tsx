import React, { useEffect } from 'react';
import { Landmark, BookOpen, X, ArrowRight, CheckCircle2, Sparkles, Layers, Sliders } from 'lucide-react';

interface BrandSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: 'simulator' | 'simple_mechanics';
  onSelectPage: (page: 'simulator' | 'simple_mechanics') => void;
}

export const BrandSwitcherModal: React.FC<BrandSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-[#FAF8F5] border border-[#D5CFBF] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden font-serif"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2DDD5] bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#1A1A1A] text-white rounded-lg">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                Monetary System Mechanics
              </h3>
              <p className="text-xs font-sans text-zinc-500">
                Choose learning mode & interface view
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Mode Options */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-sans text-zinc-600">
            Select an interface mode below:
          </p>

          {/* Option 1: Simple Mechanics (New Textbook View) */}
          <div
            onClick={() => {
              onSelectPage('simple_mechanics');
              onClose();
            }}
            className={`p-5 rounded-xl border-2 transition cursor-pointer relative ${
              currentPage === 'simple_mechanics'
                ? 'bg-amber-50/70 border-amber-600 shadow-xs'
                : 'bg-white border-[#E2DDD5] hover:border-zinc-400 hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl mt-0.5">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-serif font-bold text-[#1A1A1A]">
                      Simple Mechanics
                    </h4>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-sans font-bold uppercase rounded tracking-wide">
                      Textbook T-Accounts
                    </span>
                  </div>
                  <p className="text-xs font-serif text-zinc-600 leading-relaxed">
                    Very simple, clean classical T-account tables displayed step-by-step down the page with 4 entities side-by-side. Featuring <strong>Scenario 1: Debt Swap (USD to Yuan)</strong>, Treasury Buyback/RRP drain, and QE.
                  </p>
                </div>
              </div>
              {currentPage === 'simple_mechanics' ? (
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 ml-2 mt-1" />
              ) : (
                <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0 ml-2 mt-1" />
              )}
            </div>
          </div>

          {/* Option 2: Full Simulator Engine */}
          <div
            onClick={() => {
              onSelectPage('simulator');
              onClose();
            }}
            className={`p-5 rounded-xl border-2 transition cursor-pointer relative ${
              currentPage === 'simulator'
                ? 'bg-amber-50/70 border-amber-600 shadow-xs'
                : 'bg-white border-[#E2DDD5] hover:border-zinc-400 hover:shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-zinc-900 text-white rounded-xl mt-0.5">
                  <Sliders className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-serif font-bold text-[#1A1A1A]">
                      Monetary System Simulator
                    </h4>
                    <span className="px-2 py-0.5 bg-zinc-200 text-zinc-800 text-[10px] font-sans font-bold uppercase rounded tracking-wide">
                      Advanced Suite
                    </span>
                  </div>
                  <p className="text-xs font-serif text-zinc-600 leading-relaxed">
                    Full interactive double-entry simulation suite with 10+ macroeconomic scenarios, live animated inter-entity flow diagrams, custom balance builder, interactive sandbox engine, audit journal logs, and AI Economist.
                  </p>
                </div>
              </div>
              {currentPage === 'simulator' ? (
                <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 ml-2 mt-1" />
              ) : (
                <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0 ml-2 mt-1" />
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-[#E2DDD5] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-sans font-medium rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
