import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "../OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";
import "./ProfileButton.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
  const ulRef = useRef();

  useEffect(() => {
    if (user?.firstName) {
      const initial = user.firstName.charAt(0).toUpperCase();
      setUserInitial(initial);
    } else {
      setUserInitial(null);
    }
  }, [user]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = `profile-dropdown ${showMenu ? "" : "hidden"}`;

  return (
    <div className="profile-container">
      <button onClick={toggleMenu} className="profile-btn" aria-label="User menu">
        <div className="profile-icon-container">
          {userInitial ? (
            <div className="user-letter">{userInitial}</div>
          ) : (
            <FaUserCircle className="user-icon" />
          )}
        </div>
      </button>

      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className="dropdown-item user-info">
              <div>Hello, {user.firstName || "User"}</div>
              {user.email && <div className="user-email">{user.email}</div>}
            </li>
            <li className="dropdown-item">
              <NavLink to="/spots/current" className="manage-spots-link" onClick={closeMenu}>
                Manage Spots
              </NavLink>
            </li>
            <li className="dropdown-item">
              <NavLink to="/api/reviews/current" className="manage-reviews-link" onClick={closeMenu}>
                Manage Reviews
              </NavLink>
            </li>
            <li className="dropdown-item">
              <button onClick={logout} className="logout-btn">
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="dropdown-item">
              <OpenModalMenuItem
                itemText="Log In"
                modalComponent={<LoginFormModal />}
                onItemClick={closeMenu}
                buttonClass="dropdown-auth-btn"
              />
            </li>
            <li className="dropdown-item">
              <OpenModalMenuItem
                itemText="Sign Up"
                modalComponent={<SignupFormModal />}
                onItemClick={closeMenu}
                buttonClass="dropdown-auth-btn"
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
