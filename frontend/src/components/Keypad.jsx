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

    // Keypad hierarchy using only neutral tones:
    // - Number keys: elevated surface color
    // - Function keys: slightly darker surface, secondary text
    // - Operators: slightly lighter neutral, primary text
    // - Equals "=": solid accent blue, white text (the only colored key)
    // - Clear/Delete: same neutral as functions; turn red only on hover
    // - SHIFT/HYP toggles: neutral by default, accent-colored outline or tint ONLY when active
    // - Memory keys: same style as function keys, no special color
    let btnClass = "bg-theme-key-num hover:bg-theme-key-num-hover text-theme-text border-theme-border";

    if (type === 'num') {
      btnClass = "bg-theme-key-num hover:bg-theme-key-num-hover text-theme-text border-theme-border font-medium";
    } else if (type === 'fn' || type === 'mem') {
      btnClass = "bg-theme-key-fn hover:bg-theme-key-fn-hover text-theme-secondary hover:text-theme-text border-theme-border";
    } else if (type === 'op') {
      btnClass = "bg-theme-key-op hover:bg-theme-key-op-hover text-theme-text border-theme-border font-medium";
    } else if (type === 'shift') {
      btnClass = isShiftActive 
        ? "bg-theme-accent-subtle border-theme-accent text-theme-accent font-semibold"
        : "bg-theme-key-fn hover:bg-theme-key-fn-hover text-theme-secondary hover:text-theme-text border-theme-border";
    } else if (type === 'hyp') {
      btnClass = isHypActive 
        ? "bg-theme-accent-subtle border-theme-accent text-theme-accent font-semibold"
        : "bg-theme-key-fn hover:bg-theme-key-fn-hover text-theme-secondary hover:text-theme-text border-theme-border";
    } else if (type === 'clear') {
      btnClass = "bg-theme-key-fn hover:bg-theme-key-fn-hover text-theme-secondary hover:text-theme-error hover:border-theme-error/40 border-theme-border";
    } else if (type === 'equals') {
      btnClass = "bg-theme-key-equals hover:bg-theme-key-equals-hover text-white font-semibold border-transparent";
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
        className={`relative h-11 sm:h-12 md:h-13 min-h-[44px] rounded-md border flex flex-col items-center justify-center font-sans text-xs sm:text-sm select-none transition-all duration-150 ease-out active:scale-[0.98] ${btnClass}`}
      >
        {/* Subtle sub-label for Shift alternative */}
        {shiftLabel && !isShiftActive && (
          <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-mono text-theme-muted pointer-events-none">
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
        glyph: <SqrtGlyph size={16} />,
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
        glyph: <DeleteIcon size={16} />,
        type: 'clear',
        onClick: onBackspace
      })}
      {renderKey({
        id: 'btn-ac',
        label: 'AC',
        glyph: <ClearIcon size={16} />,
        type: 'clear',
        onClick: onClearAll
      })}

      {/* Row 5: Numbers 7, 8, 9 & Multiply, Divide */}
      {renderKey({ id: 'btn-7', label: '7', insertVal: '7', type: 'num' })}
      {renderKey({ id: 'btn-8', label: '8', insertVal: '8', type: 'num' })}
      {renderKey({ id: 'btn-9', label: '9', insertVal: '9', type: 'num' })}
      {renderKey({ id: 'btn-mult', label: '×', glyph: <MultiplyGlyph size={15} />, insertVal: '*', type: 'op' })}
      {renderKey({ id: 'btn-div', label: '÷', glyph: <DivideGlyph size={15} />, insertVal: '/', type: 'op' })}

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
        glyph: <PiGlyph size={15} />,
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
