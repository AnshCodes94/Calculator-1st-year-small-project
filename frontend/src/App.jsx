import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { postApi } from './utils/api';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HUDDisplay } from './components/HUDDisplay';
import { Keypad } from './components/Keypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { StepByStepAccordion } from './components/StepByStepAccordion';
import { SplashLoader } from './components/SplashLoader';
import { NotFound } from './components/NotFound';

import { CalculusTab } from './components/tabs/CalculusTab';
import { AlgebraTab } from './components/tabs/AlgebraTab';
import { MatrixTab } from './components/tabs/MatrixTab';
import { ComplexTab } from './components/tabs/ComplexTab';
import { GraphTab } from './components/tabs/GraphTab';
import { ExtrasTab } from './components/tabs/ExtrasTab';

import {
  ScientificIcon,
  CalculusIcon,
  AlgebraIcon,
  MatrixIcon,
  GraphIcon,
  ConverterIcon,
  HistoryIcon
} from './components/icons';

export const App = () => {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Theme Management
  const { theme, switchTheme } = useTheme();

  // Calculator State
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [numericResult, setNumericResult] = useState(null);
  const [isApprox, setIsApprox] = useState(false);
  const [steps, setSteps] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  // Modifiers
  const [angleMode, setAngleMode] = useState('rad'); // 'rad' | 'deg'
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isHypActive, setIsHypActive] = useState(false);
  const [memoryValue, setMemoryValue] = useState(0);

  // Status & Error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // History & Drawer
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('calcverse_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Navigation Active Tab
  const [activeTab, setActiveTab] = useState('scientific');

  // Splash Screen Timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persist History (up to 20 calculations)
  const saveHistoryItem = (expr, latexRes, num) => {
    const newItem = {
      expression: expr,
      latex: latexRes,
      numeric: num,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newItem, ...history].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem('calcverse_history', JSON.stringify(updated));
    } catch (e) {}
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClearAll();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (/^[0-9]$/.test(e.key)) {
        handleInsert(e.key);
      } else if (['+', '-', '*', '/', '.', '(', ')', '^', '%', '!'].includes(e.key)) {
        handleInsert(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, angleMode]);

  // Keypad Handlers
  const handleInsert = (token) => {
    setError(null);
    setExpression((prev) => prev + token);
  };

  const handleBackspace = () => {
    setError(null);
    setExpression((prev) => (prev.length > 0 ? prev.slice(0, -1) : ''));
  };

  const handleClearAll = () => {
    setExpression('');
    setResult(null);
    setNumericResult(null);
    setIsApprox(false);
    setSteps([]);
    setError(null);
  };

  const handleAns = () => {
    if (lastResult !== null) {
      handleInsert(String(lastResult));
    }
  };

  const handleToggleShift = (forceState = null) => {
    setIsShiftActive((prev) => (forceState !== null ? forceState : !prev));
  };

  const handleToggleHyp = (forceState = null) => {
    setIsHypActive((prev) => (forceState !== null ? forceState : !prev));
  };

  const handleToggleAngle = () => {
    setAngleMode((prev) => (prev === 'rad' ? 'deg' : 'rad'));
  };

  // Memory Handlers
  const handleMemoryAdd = () => {
    const val = parseFloat(numericResult || lastResult || 0);
    setMemoryValue((prev) => prev + val);
  };

  const handleMemorySubtract = () => {
    const val = parseFloat(numericResult || lastResult || 0);
    setMemoryValue((prev) => prev - val);
  };

  const handleMemoryRecall = () => {
    handleInsert(String(memoryValue));
  };

  const handleMemoryClear = () => {
    setMemoryValue(0);
  };

  // Main Calculation Request
  const handleEvaluate = async () => {
    if (!expression.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await postApi('/api/calculate', {
        expression: expression,
        angle_mode: angleMode
      });

      if (data.success && data.result) {
        const res = data.result;
        setResult(res.latex || res.exact);
        setNumericResult(res.numeric);
        setIsApprox(res.is_approx);
        setLastResult(res.numeric || res.exact);
        setSteps(data.steps || []);

        saveHistoryItem(expression, res.latex || res.exact, res.numeric);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item) => {
    setExpression(item.expression);
    setResult(item.latex || item.exact);
    setNumericResult(item.numeric);
    setIsApprox(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('calcverse_history');
    } catch (e) {}
  };

  // Navigation Tabs with Dedicated Color Accents
  const NAV_TABS = [
    { 
      id: 'scientific', 
      label: 'Keypad', 
      icon: <ScientificIcon size={16} />, 
      activeClass: 'text-blue-400 border-blue-500 bg-blue-500/10'
    },
    { 
      id: 'calculus', 
      label: 'Calculus', 
      icon: <CalculusIcon size={16} />, 
      activeClass: 'text-violet-400 border-violet-500 bg-violet-500/10'
    },
    { 
      id: 'algebra', 
      label: 'Algebra', 
      icon: <AlgebraIcon size={16} />, 
      activeClass: 'text-cyan-400 border-cyan-500 bg-cyan-500/10'
    },
    { 
      id: 'matrix', 
      label: 'Matrices', 
      icon: <MatrixIcon size={16} />, 
      activeClass: 'text-emerald-400 border-emerald-500 bg-emerald-500/10'
    },
    { 
      id: 'complex', 
      label: 'Complex', 
      icon: <ScientificIcon size={16} />, 
      activeClass: 'text-fuchsia-400 border-fuchsia-500 bg-fuchsia-500/10'
    },
    { 
      id: 'graph', 
      label: 'Plotter', 
      icon: <GraphIcon size={16} />, 
      activeClass: 'text-amber-400 border-amber-500 bg-amber-500/10'
    },
    { 
      id: 'extras', 
      label: 'Extras', 
      icon: <ConverterIcon size={16} />, 
      activeClass: 'text-indigo-400 border-indigo-500 bg-indigo-500/10'
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-theme-base text-theme-text font-sans selection:bg-blue-500/20 selection:text-white">
      
      {/* Splash Screen */}
      {showSplash && <SplashLoader />}

      {/* Top Navbar */}
      <Navbar
        angleMode={angleMode}
        onToggleAngle={handleToggleAngle}
        isShiftActive={isShiftActive}
        isHypActive={isHypActive}
        hasMemory={Math.abs(memoryValue) > 1e-12}
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        currentTheme={theme}
        onSelectTheme={switchTheme}
        isOffline={isOffline}
      />

      {/* Main Workspace */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-5">
        
        {/* Navigation Tabs (Tasteful segmented tabs with specific category accents) */}
        <nav 
          className="flex items-center gap-1.5 border-b border-theme-border/80 overflow-x-auto w-full max-w-full no-scrollbar pb-1"
          role="tablist"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-150 border ${
                  isActive
                    ? `${tab.activeClass} shadow-xs`
                    : 'text-theme-secondary hover:text-theme-text hover:bg-theme-surface/60 border-transparent'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab View Container */}
        <div className="w-full">
          {activeTab === 'scientific' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Column: Calculator Unit (Display + Keypad + Steps) */}
              <div className="lg:col-span-8 flex flex-col gap-4 card-surface p-4 sm:p-5">
                
                {/* Numeric Display Screen */}
                <HUDDisplay
                  expression={expression}
                  result={result}
                  numericResult={numericResult}
                  isApprox={isApprox}
                  error={error}
                  angleMode={angleMode}
                  isShiftActive={isShiftActive}
                  isHypActive={isHypActive}
                  hasMemory={Math.abs(memoryValue) > 1e-12}
                  isLoading={isLoading}
                  onClearError={() => setError(null)}
                  onExpressionChange={setExpression}
                />

                {/* Keypad */}
                <Keypad
                  onInsert={handleInsert}
                  onEvaluate={handleEvaluate}
                  onBackspace={handleBackspace}
                  onClearAll={handleClearAll}
                  onAns={handleAns}
                  isShiftActive={isShiftActive}
                  onToggleShift={handleToggleShift}
                  isHypActive={isHypActive}
                  onToggleHyp={handleToggleHyp}
                  onMemoryAdd={handleMemoryAdd}
                  onMemorySubtract={handleMemorySubtract}
                  onMemoryRecall={handleMemoryRecall}
                  onMemoryClear={handleMemoryClear}
                />

                {/* Step-by-Step Derivation Accordion */}
                <StepByStepAccordion steps={steps} />

              </div>

              {/* Right Column: Quick History & Tips */}
              <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
                
                {/* History Card Preview */}
                <div className="card-surface p-4 text-left flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-theme-border/80 pb-2.5">
                    <span className="font-sans font-bold text-xs text-theme-text flex items-center gap-1.5">
                      <HistoryIcon size={15} className="text-blue-400" />
                      Recent Calculations
                    </span>
                    <button
                      onClick={() => setIsHistoryOpen(true)}
                      className="text-[11px] font-mono font-medium text-blue-400 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {history.length === 0 ? (
                    <div className="py-8 text-center text-xs text-theme-muted font-mono">
                      No calculations recorded
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                      {history.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectHistory(item)}
                          className="p-2.5 rounded-lg bg-theme-elevated/70 hover:bg-theme-elevated border border-theme-border/60 hover:border-blue-500/40 cursor-pointer transition-all"
                        >
                          <div className="text-[11px] font-mono text-theme-secondary truncate">
                            {item.expression}
                          </div>
                          <div className="text-right font-mono font-bold text-blue-400 text-xs mt-0.5">
                            {item.numeric || item.latex}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Tips Card with Tasteful Color Highlights */}
                <div className="card-surface p-4 text-left flex flex-col gap-2.5 text-xs text-theme-secondary leading-relaxed">
                  <span className="font-sans font-bold text-xs text-theme-text flex items-center gap-1.5">
                    ⚡ Engineering Power Tips
                  </span>
                  <p>• Press <span className="px-1 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono font-semibold">SHIFT</span> to unlock inverse trig, roots, and antilogs.</p>
                  <p>• Use <span className="px-1 py-0.5 rounded bg-sky-500/15 text-sky-300 font-mono font-semibold">Ans</span> to cascade previous evaluation results.</p>
                  <p>• Keyboard keys: <code className="px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-mono font-medium">Enter</code> evaluates, <code className="px-1 py-0.5 rounded bg-rose-500/15 text-rose-300 font-mono font-medium">Esc</code> clears.</p>
                  <p>• Calculus and Algebra tabs support full multi-variable expressions.</p>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'calculus' && <CalculusTab />}
          {activeTab === 'algebra' && <AlgebraTab />}
          {activeTab === 'matrix' && <MatrixTab />}
          {activeTab === 'complex' && <ComplexTab />}
          {activeTab === 'graph' && <GraphTab />}
          {activeTab === 'extras' && <ExtrasTab />}
          {activeTab === '404' && <NotFound onReturnHome={() => setActiveTab('scientific')} />}
        </div>

      </main>

      {/* History Slide-Over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
};
