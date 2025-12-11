import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className='bg-black text-white p-4 flex justify-between'>
      <h1 className='font-bold text-lg'>Thread Rose Co.</h1>
      <nav className='flex gap-4'>
        <NavLink to="/" className='hover:underline'>Home</NavLink>
        <NavLink to="products" className='hover:underline'>Products</NavLink>
        <NavLink to="cart" className='hover:underline'>Cart</NavLink>
        <NavLink to="customs" className='hover:underline'>Custom Orders</NavLink>
      </nav>
    </header>
  )
}