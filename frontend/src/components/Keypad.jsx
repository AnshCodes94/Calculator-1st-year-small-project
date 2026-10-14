import React from 'react';
import { motion } from 'framer-motion';
import { 
  DivideGlyph, 
  MultiplyGlyph, 
  SqrtGlyph, 
  PiGlyph, 
  DeleteIcon, 
  ClearIcon 
} from './icons';

export const Keypad = ({
  onInsert,
  onEvaluate,
  onBackspace,
  onClearAll,
  onAns,
  isShiftActive,
  onToggleShift,
  isHypActive,
  onToggleHyp,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryRecall,
  onMemoryClear
}) => {

  // Button spring micro-interaction variants
  const keyVariants = {
    hover: { 
      scale: 1.04, 
      y: -2,
      transition: { type: 'spring', stiffness: 450, damping: 20 }
    },
    tap: { 
      scale: 0.94, 
      y: 1,
      transition: { type: 'spring', stiffness: 500, damping: 15 }
    }
  };

  // Helper to render button labels and sub-labels (with shiftness)
  const renderKey = ({
    id,
    label,
    shiftLabel,
    hypLabel,
    insertVal,
    shiftInsertVal,
    hypInsertVal,
    type = 'num', // 'num', 'fn', 'op', 'shift', 'equals', 'clear', 'mem'
    onClick,
    glyph
  }) => {
    let currentLabel = label;
    let targetInsert = insertVal;

    if (isShiftActive && (shiftLabel || shiftInsertVal)) {
      currentLabel = shiftLabel || label;
      targetInsert = shiftInsertVal || insertVal;
    } else if (isHypActive && (hypLabel || hypInsertVal)) {
      currentLabel = hypLabel || label;
      targetInsert = hypInsertVal || insertVal;
    }

    // Type-based class styling
    let btnStyle = "bg-theme-key hover:bg-theme-key-hover text-theme-text border-theme-border/60";
    if (type === 'op') {
      btnStyle = "bg-theme-operator hover:bg-theme-primary/25 text-theme-primary border-theme-primary/30 font-bold shadow-xs";
    } else if (type === 'fn') {
      btnStyle = "bg-theme-glass hover:bg-theme-glass-hover text-indigo-300 dark:text-indigo-200 border-indigo-500/20";
    } else if (type === 'shift') {
      btnStyle = isShiftActive 
        ? "bg-amber-500 text-black border-amber-400 font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.6)]" 
        : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border-amber-500/30 font-bold";
    } else if (type === 'equals') {
      btnStyle = "bg-theme-equals text-white font-extrabold shadow-glow-primary border-transparent text-xl";
    } else if (type === 'clear') {
      btnStyle = "bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/30 font-bold";
    } else if (type === 'mem') {
      btnStyle = "bg-emerald-500/12 hover:bg-emerald-500/22 text-emerald-300 border-emerald-500/25 text-xs font-bold font-mono";
    }

    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (targetInsert) {
        onInsert(targetInsert);
        // Automatically deactivate shift after inserting single shifted key
        if (isShiftActive && type !== 'shift') {
          onToggleShift(false);
        }
      }
    };

    return (
      <motion.button
        key={id}
        variants={keyVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={handleClick}
        className={`relative h-11 sm:h-12 md:h-14 min-h-[44px] rounded-lg sm:rounded-xl border flex flex-col items-center justify-center font-sans transition-colors select-none text-xs sm:text-sm md:text-base px-1 ${btnStyle}`}
      >
        {/* Secondary Sub-Label for Shift mode indicator */}
        {shiftLabel && !isShiftActive && (
          <span className="absolute top-0.5 sm:top-1 left-1 sm:left-1.5 text-[8px] sm:text-[9px] md:text-[10px] font-mono font-bold text-amber-400/90 pointer-events-none">
            {shiftLabel}
          </span>
        )}
        {glyph ? glyph : <span className="font-semibold truncate max-w-full">{currentLabel}</span>}
      </motion.button>
    );
  };

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-2.5 w-full">
      
      {/* Row 1: Function Modifiers & Memory */}
      {renderKey({
        id: 'btn-shift',
        label: 'SHIFT',
        shiftLabel: '2nd',
        type: 'shift',
        onClick: () => onToggleShift()
      })}
      {renderKey({
        id: 'btn-hyp',
        label: 'HYP',
        type: 'fn',
        onClick: () => onToggleHyp()
      })}
      {renderKey({
        id: 'btn-mc',
        label: 'MC',
        type: 'mem',
        onClick: onMemoryClear
      })}
      {renderKey({
        id: 'btn-mr',
        label: 'MR',
        type: 'mem',
        onClick: onMemoryRecall
      })}
      {renderKey({
        id: 'btn-m-plus',
        label: 'M+',
        type: 'mem',
        onClick: onMemoryAdd
      })}

      {/* Row 2: Trigonometry & Logarithms */}
      {renderKey({
        id: 'btn-sin',
        label: 'sin',
        shiftLabel: 'sin⁻¹',
        hypLabel: 'sinh',
        insertVal: 'sin(',
        shiftInsertVal: 'asin(',
        hypInsertVal: 'sinh(',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-cos',
        label: 'cos',
        shiftLabel: 'cos⁻¹',
        hypLabel: 'cosh',
        insertVal: 'cos(',
        shiftInsertVal: 'acos(',
        hypInsertVal: 'cosh(',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-tan',
        label: 'tan',
        shiftLabel: 'tan⁻¹',
        hypLabel: 'tanh',
        insertVal: 'tan(',
        shiftInsertVal: 'atan(',
        hypInsertVal: 'tanh(',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-ln',
        label: 'ln',
        shiftLabel: 'eˣ',
        insertVal: 'ln(',
        shiftInsertVal: 'exp(',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-log',
        label: 'log',
        shiftLabel: '10ˣ',
        insertVal: 'log(',
        shiftInsertVal: '10^(',
        type: 'fn'
      })}

      {/* Row 3: Powers & Roots */}
      {renderKey({
        id: 'btn-sqr',
        label: 'x²',
        shiftLabel: '√x',
        insertVal: '^2',
        shiftInsertVal: 'sqrt(',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-cube',
        label: 'x³',
        shiftLabel: '³√x',
        insertVal: '^3',
        shiftInsertVal: 'cbrt(',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-pow',
        label: 'xʸ',
        shiftLabel: 'ʸ√x',
        insertVal: '^(',
        shiftInsertVal: 'root(',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-sqrt',
        label: '√',
        insertVal: 'sqrt(',
        glyph: <SqrtGlyph size={18} />,
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-ncr',
        label: 'nCr',
        shiftLabel: 'nPr',
        insertVal: 'nCr(',
        shiftInsertVal: 'nPr(',
        type: 'fn'
      })}

      {/* Row 4: Brackets, Factorial, Backspace, Clear */}
      {renderKey({
        id: 'btn-lparen',
        label: '(',
        shiftLabel: '|x|',
        insertVal: '(',
        shiftInsertVal: 'abs(',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-rparen',
        label: ')',
        insertVal: ')',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-fact',
        label: 'x!',
        insertVal: '!',
        type: 'fn'
      })}
      {renderKey({
        id: 'btn-del',
        label: 'DEL',
        glyph: <DeleteIcon size={18} />,
        type: 'clear',
        onClick: onBackspace
      })}
      {renderKey({
        id: 'btn-ac',
        label: 'AC',
        glyph: <ClearIcon size={18} />,
        type: 'clear',
        onClick: onClearAll
      })}

      {/* Row 5: Numbers 7, 8, 9 & Multiply, Divide */}
      {renderKey({ id: 'btn-7', label: '7', insertVal: '7', type: 'num' })}
      {renderKey({ id: 'btn-8', label: '8', insertVal: '8', type: 'num' })}
      {renderKey({ id: 'btn-9', label: '9', insertVal: '9', type: 'num' })}
      {renderKey({ id: 'btn-mult', label: '×', glyph: <MultiplyGlyph size={18} />, insertVal: '*', type: 'op' })}
      {renderKey({ id: 'btn-div', label: '÷', glyph: <DivideGlyph size={18} />, insertVal: '/', type: 'op' })}

      {/* Row 6: Numbers 4, 5, 6 & Add, Subtract */}
      {renderKey({ id: 'btn-4', label: '4', insertVal: '4', type: 'num' })}
      {renderKey({ id: 'btn-5', label: '5', insertVal: '5', type: 'num' })}
      {renderKey({ id: 'btn-6', label: '6', insertVal: '6', type: 'num' })}
      {renderKey({ id: 'btn-add', label: '+', insertVal: '+', type: 'op' })}
      {renderKey({ id: 'btn-sub', label: '−', insertVal: '-', type: 'op' })}

      {/* Row 7: Numbers 1, 2, 3 & Constants Pi, Percent */}
      {renderKey({ id: 'btn-1', label: '1', insertVal: '1', type: 'num' })}
      {renderKey({ id: 'btn-2', label: '2', insertVal: '2', type: 'num' })}
      {renderKey({ id: 'btn-3', label: '3', insertVal: '3', type: 'num' })}
      {renderKey({
        id: 'btn-pi',
        label: 'π',
        shiftLabel: 'e',
        glyph: <PiGlyph size={18} />,
        insertVal: 'pi',
        shiftInsertVal: 'e',
        type: 'fn'
      })}
      {renderKey({ id: 'btn-pct', label: '%', insertVal: '%', type: 'fn' })}

      {/* Row 8: 0, Dot, Ans, Imaginary i, Equals */}
      {renderKey({ id: 'btn-0', label: '0', insertVal: '0', type: 'num' })}
      {renderKey({ id: 'btn-dot', label: '.', insertVal: '.', type: 'num' })}
      {renderKey({ id: 'btn-ans', label: 'Ans', onClick: onAns, type: 'fn' })}
      {renderKey({ id: 'btn-i', label: 'i', insertVal: 'i', type: 'fn' })}
      {renderKey({
        id: 'btn-equals',
        label: '=',
        onClick: onEvaluate,
        type: 'equals'
      })}

    </div>
  );
};
