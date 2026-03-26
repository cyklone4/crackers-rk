import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalStyles from './components/GlobalStyles';

// Context Providers
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';

// Pages
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ContactPage from './pages/ContactPage';
import AllInOnePage from './pages/AllInOnePage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnsRefundsPage from './pages/ReturnsRefundsPage';
import DisclaimersPage from './pages/DisclaimersPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SafetyGuidelinesPage from './pages/SafetyGuidelinesPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <HelmetProvider>
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <ProductsProvider>
          <CartProvider>
            <GlobalStyles />
            <div className="App">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/categories/:categoryPath" element={<CategoryPage />} />
                  <Route path="/product/:productId" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/all-products" element={<AllInOnePage />} />
                  <Route path="/shipping" element={<ShippingPolicyPage />} />
                  <Route path="/returns" element={<ReturnsRefundsPage />} />
                  <Route path="/disclaimers" element={<DisclaimersPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/safety" element={<SafetyGuidelinesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
          </ProductsProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;
