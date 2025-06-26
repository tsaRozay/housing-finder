import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { HiBars3 } from "react-icons/hi2";
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/') // Navigates to home page after logging out
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} className='profile-button'>
        <div className='menu'>
          <HiBars3 size={30} />
        </div>
        <div className='user'>
          <FaUserCircle size={30}/>
        </div>
      </button>

      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
          <div className="options">
            <div>Hello, {user.firstName}</div>
            <div>{user.email}</div>
          </div>
          <hr />
          <div className="manage-div">
            <div>
              <Link to="/api/spots/current" className="manage-link">
                Manage Spots
              </Link>
            </div>
            <div>
              <Link to="/api/reviews/current" className="manage-link">
                Manage Reviews
              </Link>
            </div>
          </div>
          <hr />
          <div className="logout-button-div">
            <button className="logout-button" onClick={logout}>
              Log Out
            </button>
          </div>
        </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
