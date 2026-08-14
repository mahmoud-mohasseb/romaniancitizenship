'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ExternalLink } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, imageUrl, title, caption }) {
  if (!isOpen || !imageUrl) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Action Button */}
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 p-2.5 bg-black/60 hover:bg-rose-600 text-white rounded-full border border-white/20 transition-all z-10 shadow-lg"
            title="Close image view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Full Resolution Image Frame */}
          <div className="relative max-w-full max-h-[80vh] w-auto h-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/60 bg-slate-950 flex items-center justify-center p-2">
            <img 
              src={imageUrl} 
              alt={title || 'Image Preview'}
              onError={(e) => {
                e.currentTarget.src = '/icon.png';
              }}
              className="max-w-full max-h-[75vh] object-contain rounded-xl"
            />
          </div>

          {/* Caption Details */}
          {(title || caption) && (
            <div className="text-center text-white space-y-1 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 max-w-xl">
              {title && <h3 className="text-sm font-black leading-snug">{title}</h3>}
              {caption && <p className="text-xs text-slate-300">{caption}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
