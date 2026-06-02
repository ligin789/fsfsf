import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-white p-3">
      <nav className="container d-flex justify-content-between align-items-center">
        <h2 className="m-0">Velos</h2>
        <div className="d-flex gap-3">
          <Link to="/" className="text-white text-decoration-none">Home</Link>
          <Link to="/login" className="text-white text-decoration-none">Login</Link>
          <Link to="/signup" className="text-white text-decoration-none">Signup</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
