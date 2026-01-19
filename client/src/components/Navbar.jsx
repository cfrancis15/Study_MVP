// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = useLocation().pathname;

  return (
    <nav className="nav">
      <Link to="/">Study Coach</Link>
      <button className="nav-toggle" onClick={() => setOpen(!open)}>☰</button>
      <ul className={`nav-menu ${open ? 'open' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to='/study'>Study</Link></li>
        <li>
          <SignedOut><SignInButton mode='modal'/></SignedOut>
          <SignedIn><UserButton /></SignedIn>
        </li>
      </ul>
    </nav>
  );
}