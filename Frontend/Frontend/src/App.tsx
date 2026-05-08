import { Link } from 'react-router-dom'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <nav className="bg-surface px-8 py-4 flex justify-between items-center border-b border-border shadow-sm sticky top-0 z-50">
        <Link to="/" className="no-underline">
          <div className="text-2xl font-bold text-primary tracking-tight">FoodStore</div>
        </Link>
        <ul className="flex list-none gap-6 m-0 p-0">
          <li><Link to="/" className="text-text-muted font-medium hover:text-primary transition-colors no-underline">Inicio</Link></li>
          <li><Link to="/categorias" className="text-text-muted font-medium hover:text-primary transition-colors no-underline">Categorías</Link></li>
          <li><Link to="/productos" className="text-text-muted font-medium hover:text-primary transition-colors no-underline">Productos</Link></li>
          <li><Link to="/ingredientes" className="text-text-muted font-medium hover:text-primary transition-colors no-underline">Ingredientes</Link></li>
        </ul>
      </nav>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <AppRouter />
      </main>
    </div>
  )
}

export default App
