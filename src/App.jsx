import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { I18nProvider } from "./i18n/I18nContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import RecordDetail from "./pages/RecordDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import ThankYou from "./pages/ThankYou";
import Admin from "./pages/Admin";

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CartProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/record/:id" element={<RecordDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;