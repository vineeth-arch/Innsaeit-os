import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Launcher from './Launcher';

const CompressPage = lazy(() => import('./tools/pages/CompressPage'));
const VectorizePage = lazy(() => import('./tools/pages/VectorizePage'));
const PalettePage = lazy(() => import('./tools/pages/PalettePage'));
const CodesPage = lazy(() => import('./tools/pages/CodesPage'));
const CaseConverterPage = lazy(() => import('./tools/pages/CaseConverterPage'));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Launcher />} />
        <Route path="/tools/compress" element={<CompressPage />} />
        <Route path="/tools/vectorize" element={<VectorizePage />} />
        <Route path="/tools/palette" element={<PalettePage />} />
        <Route path="/tools/codes" element={<CodesPage />} />
        <Route path="/tools/case" element={<CaseConverterPage />} />
      </Routes>
    </Suspense>
  );
}
