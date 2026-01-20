import { Routes, Route } from 'react-router-dom'
import { AdminAuthProvider } from "./context/AdminAuthProvider"
import { AdminProtectedRoute } from './routes/AdminProtectedRoute'
import './App.css'

// Public layout and pages
import Layout from './components/Layout'
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import CartPage from './pages/Cart'
import CustomOrdersPage from './pages/Customs'
import NotFoundPage from './pages/NotFound'

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminLogin } from './pages/admin/AdminLogin'

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          {/* Public pages */}
          <Route index element={<HomePage />} />
          <Route path='products' element={<ProductsPage />} />
          <Route path='cart' element={<CartPage />} />
          <Route path='customs' element={<CustomOrdersPage />} />
          
          {/* Admin login (public) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin pages */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
        
        {/* 404 */}
        <Route path="*" element = {<NotFoundPage />} />
      </Routes>
    </AdminAuthProvider>
  )
}

export default App