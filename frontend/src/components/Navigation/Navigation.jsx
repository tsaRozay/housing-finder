import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { GiHouse } from "react-icons/gi";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <NavLink to="/" className="home-logo">
            <GiHouse size={35} color="#000000" />
          </NavLink>
          <NavLink to="/" className="title">Housing Finder</NavLink>
        </div>
        <div className="nav-right">
          {sessionUser && (
            <div className="new-spot-link">
              <NavLink to="/api/spots" className="create-link">
                Create a New Spot
              </NavLink>
            </div>
          )}
          <div className="profile-btn-wrapper">
            {isLoaded && <ProfileButton user={sessionUser} />}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
