import { Routes, Route } from 'react-router-dom'
import PasswordGate from './components/PasswordGate'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToHash from './components/ScrollToHash'
import { CartProvider } from './lib/CartContext'
import Home from './pages/Home'
import Platform from './pages/Platform'
import Category from './pages/Category'
import Apparel from './pages/Apparel'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import OurStory from './pages/OurStory'
import Admin from './pages/Admin'

export default function App() { 
  return (
    <PasswordGate>
      <CartProvider>
        <div className="min-h-screen bg-black flex flex-col">
          <ScrollToHash />
          <Nav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/platform/:id" element={<Platform />} />
              <Route path="/category/:id" element={<Category />} />
              <Route path="/apparel" element={<Apparel />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </PasswordGate>
  )
}
