import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';
import { ChevronDownIcon, ScientificIcon } from './icons';

export const StepByStepAccordion = ({ steps }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full mt-4 border-t border-theme-border/60 pt-4">
      {/* Accordion Toggle Header */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 rounded-xl bg-theme-glass hover:bg-theme-glass-hover border border-theme-border text-theme-text text-sm font-semibold transition-all"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 text-theme-primary">
          <ScientificIcon size={18} />
          <span>Step-by-Step Mathematical Derivation ({steps.length} Steps)</span>
        </div>
        <ChevronDownIcon 
          size={18} 
          className={`text-theme-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-theme-primary' : ''}`} 
        />
      </motion.button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden flex flex-col gap-2.5 mt-3"
          >
            {steps.map((step, idx) => (
              <StepItem key={idx} index={idx + 1} step={step} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StepItem = ({ index, step }) => {
  const [renderedLatex, setRenderedLatex] = useState('');

  useEffect(() => {
    if (!step.latex) return;
    try {
      const html = katex.renderToString(step.latex, {
        throwOnError: false,
        displayMode: true
      });
      setRenderedLatex(html);
    } catch (e) {
      setRenderedLatex(step.latex);
    }
  }, [step.latex]);

  return (
    <div className="p-3.5 rounded-xl bg-theme-glass/60 border border-theme-border/50 border-l-4 border-l-theme-primary flex flex-col gap-1.5 text-left">
      <div className="text-xs font-mono font-bold text-theme-primary tracking-wide">
        Step {index}: {step.title}
      </div>

      {/* Rendered Math Formula */}
      {step.latex && (
        <div 
          className="overflow-x-auto py-1 text-theme-text text-sm sm:text-base font-display"
          dangerouslySetInnerHTML={{ __html: renderedLatex }}
        />
      )}

      {/* Theorem / Explanation */}
      {step.explanation && (
        <p className="text-xs text-theme-muted font-sans leading-relaxed">
          {step.explanation}
        </p>
      )}
    </div>
  );
};
