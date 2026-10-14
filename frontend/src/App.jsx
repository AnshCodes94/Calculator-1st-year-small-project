import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import { useParallax } from './hooks/useParallax';
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

  // Theme & Ambient Parallax
  const { theme, switchTheme } = useTheme();
  const { normalizedX, normalizedY, prefersReducedMotion } = useParallax();

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
  const [activeTab, setActiveTab] = useState('scientific'); // 'scientific', 'calculus', 'algebra', 'matrix', 'complex', 'graph', 'extras', '404'

  // Splash Screen Timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
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

  // Navigation Tabs Definition
  const NAV_TABS = [
    { id: 'scientific', label: 'Keypad', icon: <ScientificIcon size={16} /> },
    { id: 'calculus', label: 'Calculus', icon: <CalculusIcon size={16} /> },
    { id: 'algebra', label: 'Algebra', icon: <AlgebraIcon size={16} /> },
    { id: 'matrix', label: 'Matrices', icon: <MatrixIcon size={16} /> },
    { id: 'complex', label: 'Complex', icon: <ScientificIcon size={16} /> },
    { id: 'graph', label: 'Plotter', icon: <GraphIcon size={16} /> },
    { id: 'extras', label: 'Extras', icon: <ConverterIcon size={16} /> },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      
      {/* Animated Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashLoader />}
      </AnimatePresence>

      {/* Mesh Gradient Ambient Background Blobs with Subtle Mouse Parallax */}
      <div className="mesh-bg">
        <motion.div
          className="aurora-blob blob-1"
          style={
            !prefersReducedMotion
              ? { x: normalizedX * 25, y: normalizedY * 20 }
              : {}
          }
        />
        <motion.div
          className="aurora-blob blob-2"
          style={
            !prefersReducedMotion
              ? { x: -normalizedX * 30, y: -normalizedY * 25 }
              : {}
          }
        />
        <motion.div
          className="aurora-blob blob-3"
          style={
            !prefersReducedMotion
              ? { x: normalizedX * 15, y: normalizedY * 35 }
              : {}
          }
        />
      </div>

      {/* Film Grain Texture Overlay */}
      <div className="noise-overlay" />

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
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        
        {/* Navigation Mode Pill Tabs with Animated Indicator */}
        <nav 
          className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-theme-surface/70 backdrop-blur-xl border border-theme-border/60 overflow-x-auto w-full max-w-full no-scrollbar shadow-sm"
          role="tablist"
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-theme-primary'
                    : 'text-theme-muted hover:text-theme-text hover:bg-theme-glass'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>

                {/* Animated Layout Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute inset-0 rounded-xl bg-theme-primary/12 border border-theme-primary/30 shadow-glow-primary -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Tab View Container */}
        <div className="w-full">
          {activeTab === 'scientific' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Calculator Unit (HUD + Keypad + Steps) */}
              <div className="lg:col-span-8 flex flex-col gap-4 glass-panel p-4 sm:p-6 shadow-glass-card">
                
                {/* Futuristic HUD Display */}
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
                <div className="glass-panel p-5 text-left flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-theme-border/60 pb-2.5">
                    <span className="font-display font-bold text-sm text-theme-text flex items-center gap-2">
                      <HistoryIcon size={16} className="text-theme-primary" />
                      Recent Calculations
                    </span>
                    <button
                      onClick={() => setIsHistoryOpen(true)}
                      className="text-[11px] font-mono text-theme-primary hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {history.length === 0 ? (
                    <div className="py-8 text-center text-xs text-theme-muted font-mono">
                      No calculations recorded
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                      {history.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectHistory(item)}
                          className="p-2.5 rounded-lg bg-theme-glass hover:bg-theme-glass-hover border border-theme-border/40 cursor-pointer transition-all"
                        >
                          <div className="text-[11px] font-mono text-theme-muted truncate">
                            {item.expression}
                          </div>
                          <div className="text-right font-display font-bold text-theme-primary text-sm">
                            {item.numeric || item.latex}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts & Formula Tips */}
                <div className="glass-panel p-5 text-left flex flex-col gap-2.5 text-xs text-theme-muted leading-relaxed">
                  <span className="font-display font-bold text-sm text-theme-text">
                    ⚡ Engineering Power Tips
                  </span>
                  <p>• Press <strong className="text-amber-400">SHIFT</strong> to activate inverse trig, roots, and antilogs.</p>
                  <p>• Use <strong className="text-theme-primary">Ans</strong> to cascade your previous answer into new formulas.</p>
                  <p>• Keyboard keys: <code className="text-theme-text">Enter</code> evaluates, <code className="text-theme-text">Esc</code> clears.</p>
                  <p>• Multi-variable equations are seamlessly supported across the Calculus and Algebra tabs.</p>
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

      {/* History Slide-Over Glass Drawer */}
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
