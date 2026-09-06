import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Institution } from './pages/Institution';
import { LegalTexts } from './pages/LegalTexts';
import { NewsList } from './pages/NewsList';
import { NewsDetail } from './pages/NewsDetail';
import { Multimedia } from './pages/Multimedia';
import { Gallery } from './pages/Gallery';
import { Partners } from './pages/Partners';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// Helper component to scroll to top on route changes
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

export const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col justify-between bg-cnds-white text-cnds-ink selection:bg-cnds-red/10 selection:text-cnds-red">
            <Header />
            <main className="grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/institution" element={<Institution />} />
                <Route path="/textes-juridiques" element={<LegalTexts />} />
                <Route path="/actualites" element={<NewsList />} />
                <Route path="/actualites/:slug" element={<NewsDetail />} />
                <Route path="/multimedia" element={<Multimedia />} />
                <Route path="/galerie" element={<Gallery />} />
                <Route path="/partenaires" element={<Partners />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 Catch-All */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};
