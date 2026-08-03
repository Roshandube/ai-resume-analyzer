import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const navLinks = token ? (
    <>
      <Link
        to="/"
        className="text-sm font-medium transition hover:text-slate-200"
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/dashboard"
        className="text-sm font-medium transition hover:text-slate-200"
        onClick={() => setMenuOpen(false)}
      >
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="text-left text-sm font-medium transition hover:text-slate-200"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/"
        className="text-sm font-medium transition hover:text-slate-200"
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/login"
        className="text-sm font-medium transition hover:text-slate-200"
        onClick={() => setMenuOpen(false)}
      >
        Login
      </Link>
      <Link
        to="/register"
        className="text-sm font-medium transition hover:text-slate-200"
        onClick={() => setMenuOpen(false)}
      >
        Register
      </Link>
    </>
  );

  return (
    <nav className="bg-slate-950 text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold tracking-tight sm:text-xl">
          AI Resume Analyzer
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-slate-700 px-3 py-2 text-sm font-medium md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className="hidden items-center gap-6 md:flex">{navLinks}</div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">{navLinks}</div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
