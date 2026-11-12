import React from 'react';
import { X, Check } from 'lucide-react';
import { SymbolSkin } from '../types/game';
import { SKINS } from '../utils/skins';

interface SkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkinId: string;
  onSelectSkin: (skin: SymbolSkin) => void;
}

export const SkinsModal: React.FC<SkinsModalProps> = ({
  isOpen,
  onClose,
  selectedSkinId,
  onSelectSkin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop-in">
      <div className="relative w-full max-w-md bg-[#252525] border border-[#383838] rounded-3xl p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#383838]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Select Marker Theme
            </h3>
            <p className="text-xs text-neutral-400">
              Customize your grid symbols and visual effects
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skins List */}
        <div className="grid gap-2.5 my-4 max-h-[60vh] overflow-y-auto pr-1">
          {SKINS.map((skin) => {
            const isSelected = skin.id === selectedSkinId;
            return (
              <button
                key={skin.id}
                onClick={() => {
                  onSelectSkin(skin);
                  onClose();
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#262c38] border-blue-500 shadow-md ring-1 ring-blue-500/50'
                    : 'bg-[#2b2b2b] border-[#383838] hover:bg-[#333333] hover:border-[#444444]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1f1f1f] border border-[#383838] text-lg font-black">
                    <span className={skin.xColor}>{skin.xDisplay}</span>
                    <span className="text-neutral-500 text-xs">vs</span>
                    <span className={skin.oColor}>{skin.oDisplay}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {skin.name}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {skin.description}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-[#333333] hover:bg-[#3d3d3d] rounded-xl transition-colors cursor-pointer border border-[#444444]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
