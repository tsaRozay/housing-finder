// Navigation.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import logo from '../../assets/logo.png';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state?.session?.user ?? null);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleHomeRedirect = (e) => {
    e.preventDefault();
    setIsRedirecting(true);
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      navigate("/");
      setIsRedirecting(false);
    }, delay);
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <li>
          <NavLink to="/spots/new" className="create-spot-link">
            Create a New Spot
          </NavLink>
        </li>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </>
    );
  } else {
    sessionLinks = (
      <>
        <li>
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            buttonClass="nav-login-button"
          />
        </li>
        <li>
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            buttonClass="nav-signup-button"
          />
        </li>
      </>
    );
  }

  if (isRedirecting) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Redirecting to the Homepage...</h2>
        </div>
      </div>
    );
  }

  return (
    <nav className="navigation-bar">
      <div className="nav-left">
        <ul className="nav-links">
          <li className="nav-home">
            <NavLink to="/" end onClick={handleHomeRedirect} className="nav-link">
              <img src={logo} alt="Home" className="nav-logo" />
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="nav-right">
        <ul className="nav-links">
          {isLoaded && sessionLinks}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
