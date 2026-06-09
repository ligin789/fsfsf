import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-primary text-white p-3">
      <nav className="container d-flex justify-content-between align-items-center">
        <h2 className="m-0">Velos</h2>
        <div className="d-flex gap-3 align-items-center">
          <Link to="/" className="text-white text-decoration-none">Home</Link>
          <Link to="/login" className="text-white text-decoration-none">Login</Link>
          <Link to="/signup" className="text-white text-decoration-none">Signup</Link>
          <div className="form-check form-switch m-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="themeSwitch"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <label className="form-check-label" htmlFor="themeSwitch">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </label>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
