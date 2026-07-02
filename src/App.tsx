import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import Launcher from './Launcher';
import SettingsPage from './SettingsPage';

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
const UnitsPage = lazy(() => import('./tools/pages/UnitsPage'));
const DielinePage = lazy(() => import('./tools/pages/DielinePage'));
const SheetPage = lazy(() => import('./tools/pages/SheetPage'));
const BarcodeSizePage = lazy(() => import('./tools/pages/BarcodeSizePage'));
const CounterPage = lazy(() => import('./tools/pages/CounterPage'));
const SlugPage = lazy(() => import('./tools/pages/SlugPage'));
const DiffPage = lazy(() => import('./tools/pages/DiffPage'));
const HarmonyPage = lazy(() => import('./tools/pages/HarmonyPage'));
const ShadesPage = lazy(() => import('./tools/pages/ShadesPage'));
const TypeScalePage = lazy(() => import('./tools/pages/TypeScalePage'));
const JsonPage = lazy(() => import('./tools/pages/JsonPage'));
const PaperPage = lazy(() => import('./tools/pages/PaperPage'));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Home + Tool Hub + Settings share the persistent tab/search/theme shell. */}
        <Route element={<AppShell />}>
          <Route path="/" element={<Launcher />} />
          <Route path="/tools" element={<ToolHubPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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
        <Route path="/tools/units" element={<UnitsPage />} />
        <Route path="/tools/dieline" element={<DielinePage />} />
        <Route path="/tools/sheet" element={<SheetPage />} />
        <Route path="/tools/barcode-size" element={<BarcodeSizePage />} />
        <Route path="/tools/counter" element={<CounterPage />} />
        <Route path="/tools/slug" element={<SlugPage />} />
        <Route path="/tools/diff" element={<DiffPage />} />
        <Route path="/tools/harmony" element={<HarmonyPage />} />
        <Route path="/tools/shades" element={<ShadesPage />} />
        <Route path="/tools/typescale" element={<TypeScalePage />} />
        <Route path="/tools/json" element={<JsonPage />} />
        <Route path="/tools/paper" element={<PaperPage />} />

        <Route path="/tools/lab" element={<Navigate to="/tools" replace />} />
        <Route path="/resources/delphitools" element={<Navigate to="/tools" replace />} />
      </Routes>
    </Suspense>
  );
}
