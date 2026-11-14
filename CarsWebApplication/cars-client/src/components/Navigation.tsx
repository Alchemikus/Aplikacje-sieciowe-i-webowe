import { NavLink, useNavigate } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Navigation() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const favoriteCount = useCarUiStore((state) =>
    user ? (state.favoriteCarIdsByUser[user.id] ?? []).length : 0
  );

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <nav className="nav-center">
        <NavLink to="/" className="nav-link" end>
          Strona główna
        </NavLink>
        
        {user && (
          <>
            <NavLink to="/cars" className="nav-link" end>
              Samochody
            </NavLink>
          </>
        )}

        <NavLink to="/about" className="nav-link">
          O aplikacji
        </NavLink>
      </nav>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-text">Ulubione: {favoriteCount}</span>
            <span className="nav-text">
              {user.userName} ({user.roles.join(', ')})
            </span>
            <button className="nav-btn" onClick={handleLogout}>
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              Logowanie
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Rejestracja
            </NavLink>
          </>
        )}
      </div>
    </>
  );
}
