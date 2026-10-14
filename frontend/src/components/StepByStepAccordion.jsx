import React, { useState, useEffect } from 'react';
import katex from 'katex';
import { ChevronDownIcon, ScientificIcon } from './icons';

export const StepByStepAccordion = ({ steps }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full mt-4 border-t border-theme-border pt-4">
      {/* Accordion Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-md bg-theme-surface hover:bg-theme-hover border border-theme-border text-theme-text text-xs sm:text-sm font-medium transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 text-theme-secondary">
          <ScientificIcon size={16} />
          <span className="text-theme-text">Step-by-Step Working ({steps.length} Steps)</span>
        </div>
        <ChevronDownIcon 
          size={16} 
          className={`text-theme-muted transition-transform duration-150 ${isOpen ? 'rotate-180 text-theme-text' : ''}`} 
        />
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="flex flex-col gap-2 mt-2.5">
          {steps.map((step, idx) => (
            <StepItem key={idx} index={idx + 1} step={step} />
          ))}
        </div>
      )}
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
    <div className="p-3 rounded-md bg-theme-surface border border-theme-border flex flex-col gap-1 text-left">
      <div className="text-xs font-mono font-medium text-theme-accent">
        Step {index}: {step.title}
      </div>

      {/* Rendered Math Formula */}
      {step.latex && (
        <div 
          className="overflow-x-auto py-1 text-theme-text text-sm font-mono"
          dangerouslySetInnerHTML={{ __html: renderedLatex }}
        />
      )}

      {/* Explanation */}
      {step.explanation && (
        <p className="text-xs text-theme-secondary font-sans leading-relaxed">
          {step.explanation}
        </p>
      )}
    </div>
  );
};
