import React from 'react';
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

  const renderKey = ({
    id,
    label,
    shiftLabel,
    hypLabel,
    insertVal,
    shiftInsertVal,
    hypInsertVal,
    type = 'num', // 'num', 'fn', 'op', 'shift', 'hyp', 'equals', 'clear', 'mem'
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

    // Tasteful, modern functional color hierarchy:
    // - Number keys: clean slate neutral
    // - Function keys: soft violet tint
    // - Operator keys: soft cyan tint
    // - Clear/Delete keys: soft rose tint
    // - SHIFT: amber accent
    // - HYP: purple accent
    // - Memory: emerald accent
    // - Equals: vibrant electric blue/indigo gradient
    let btnClass = "bg-theme-elevated hover:bg-theme-elevated-hover text-theme-text border-theme-border";

    if (type === 'num') {
      btnClass = "bg-[#141D2E] hover:bg-[#1C273C] text-slate-100 border-[#223048] font-medium";
    } else if (type === 'fn') {
      btnClass = "bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border-violet-500/25";
    } else if (type === 'op') {
      btnClass = "bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border-sky-500/25 font-semibold";
    } else if (type === 'mem') {
      btnClass = "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/25 font-mono text-xs";
    } else if (type === 'shift') {
      btnClass = isShiftActive 
        ? "bg-amber-500 text-black border-amber-400 font-bold shadow-sm"
        : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30 font-semibold";
    } else if (type === 'hyp') {
      btnClass = isHypActive 
        ? "bg-purple-600 text-white border-purple-400 font-bold shadow-sm"
        : "bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border-purple-500/30 font-semibold";
    } else if (type === 'clear') {
      btnClass = "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/25 font-semibold";
    } else if (type === 'equals') {
      btnClass = "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold border-transparent shadow-md shadow-blue-500/25";
    }

    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (targetInsert) {
        onInsert(targetInsert);
        if (isShiftActive && type !== 'shift') {
          onToggleShift(false);
        }
      }
    };

    return (
      <button
        key={id}
        onClick={handleClick}
        className={`relative h-11 sm:h-12 md:h-13 min-h-[44px] rounded-lg border flex flex-col items-center justify-center font-sans text-xs sm:text-sm select-none transition-all duration-150 ease-out active:scale-[0.97] ${btnClass}`}
      >
        {/* Shift alternative sub-label */}
        {shiftLabel && !isShiftActive && (
          <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-mono font-medium text-amber-400/80 pointer-events-none">
            {shiftLabel}
          </span>
        )}
        {glyph ? glyph : <span className="truncate max-w-full px-1">{currentLabel}</span>}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full">
      
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
        type: 'hyp',
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

      {/* Row 2: Trigonometry & Logarithms (Violet Group) */}
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

      {/* Row 3: Powers & Roots (Violet Group) */}
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
        glyph: <SqrtGlyph size={16} className="text-violet-300" />,
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
        glyph: <DeleteIcon size={16} className="text-rose-300" />,
        type: 'clear',
        onClick: onBackspace
      })}
      {renderKey({
        id: 'btn-ac',
        label: 'AC',
        glyph: <ClearIcon size={16} className="text-rose-300" />,
        type: 'clear',
        onClick: onClearAll
      })}

      {/* Row 5: Numbers 7, 8, 9 & Multiply, Divide (Cyan Operators) */}
      {renderKey({ id: 'btn-7', label: '7', insertVal: '7', type: 'num' })}
      {renderKey({ id: 'btn-8', label: '8', insertVal: '8', type: 'num' })}
      {renderKey({ id: 'btn-9', label: '9', insertVal: '9', type: 'num' })}
      {renderKey({ id: 'btn-mult', label: '×', glyph: <MultiplyGlyph size={15} className="text-sky-400" />, insertVal: '*', type: 'op' })}
      {renderKey({ id: 'btn-div', label: '÷', glyph: <DivideGlyph size={15} className="text-sky-400" />, insertVal: '/', type: 'op' })}

      {/* Row 6: Numbers 4, 5, 6 & Add, Subtract (Cyan Operators) */}
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
        glyph: <PiGlyph size={15} className="text-violet-300" />,
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
