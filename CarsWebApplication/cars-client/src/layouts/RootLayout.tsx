import { NavLink, Outlet, Link } from 'react-router';
import { Toaster } from 'react-hot-toast';
import './RootLayout.css';

export default function RootLayout() {
  return (
    <div className="app-layout">
      <Toaster 
        position="top-right" 
        containerStyle={{ 
          top: '70px', 
          right: '20px',
          overflow: 'hidden' 
        }}
        toastOptions={{ 
          duration: 4000,
          className: 'slide-toast base-toast',
          success: { className: 'slide-toast toast-success' },
          error: { className: 'slide-toast toast-error' },
        }} 
      />

      <header className="main-header">
        <div className="nav-left">
          <Link to="/" className="brand-logo">
            AutoManager
          </Link>
          <nav>
            <NavLink 
              to="/cars" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Samochody
            </NavLink>
          </nav>
        </div>
      </header>
      
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}