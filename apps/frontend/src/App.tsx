import { Routes, Route } from 'react-router-dom'
import './App.css'

// Page imports
import Layout from './components/Layout'
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import CartPage from './pages/Cart'
import CustomOrdersPage from './pages/Customs'
import NotFoundPage from './pages/NotFound'
import DashboardPage from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='products' element={<ProductsPage />} />
        <Route path='cart' element={<CartPage />} />
        <Route path='customs' element={<CustomOrdersPage />} />
        <Route path='dashboard' element={<DashboardPage/>} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App