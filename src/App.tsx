import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import Launcher from './Launcher';

const CompressPage = lazy(() => import('./tools/pages/CompressPage'));
const VectorizePage = lazy(() => import('./tools/pages/VectorizePage'));
const PalettePage = lazy(() => import('./tools/pages/PalettePage'));
const CodesPage = lazy(() => import('./tools/pages/CodesPage'));
const CaseConverterPage = lazy(() => import('./tools/pages/CaseConverterPage'));
const ToolHubPage = lazy(() => import('./tools/pages/ToolHubPage'));
const ContrastCheckerPage = lazy(() => import('./tools/pages/ContrastCheckerPage'));
const CmykConverterPage = lazy(() => import('./tools/pages/CmykConverterPage'));
const BleedCalculatorPage = lazy(() => import('./tools/pages/BleedCalculatorPage'));
const BatchResizePage = lazy(() => import('./tools/pages/BatchResizePage'));
const Gs1ValidatorPage = lazy(() => import('./tools/pages/Gs1ValidatorPage'));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Home + Tool Hub share the persistent tab/search/theme shell. */}
        <Route element={<AppShell />}>
          <Route path="/" element={<Launcher />} />
          <Route path="/tools" element={<ToolHubPage />} />
        </Route>

        {/* Individual tool pages are focused single-tool views — no shell. */}
        <Route path="/tools/compress" element={<CompressPage />} />
        <Route path="/tools/vectorize" element={<VectorizePage />} />
        <Route path="/tools/palette" element={<PalettePage />} />
        <Route path="/tools/codes" element={<CodesPage />} />
        <Route path="/tools/case" element={<CaseConverterPage />} />
        <Route path="/tools/contrast" element={<ContrastCheckerPage />} />
        <Route path="/tools/cmyk" element={<CmykConverterPage />} />
        <Route path="/tools/bleed" element={<BleedCalculatorPage />} />
        <Route path="/tools/batch-resize" element={<BatchResizePage />} />
        <Route path="/tools/gs1" element={<Gs1ValidatorPage />} />

        <Route path="/tools/lab" element={<Navigate to="/tools" replace />} />
        <Route path="/resources/delphitools" element={<Navigate to="/tools" replace />} />
      </Routes>
    </Suspense>
  );
}
