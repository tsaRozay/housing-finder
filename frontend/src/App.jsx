import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import { restoreUser } from './store/session';
import { fetchSpots } from './store/spots';

import LandingPage from './components/LandingPage';
import SpotDetails from './components/SpotDetails';
import CreateSpot from './components/CreateSpot';
import ManageSpots from './components/ManageSpots';
import UpdateSpot from './components/UpdateSpot';
import ManageReviews from './components/ManageReviews';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreUser()).then(() => {
      dispatch(fetchSpots());
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/spots/new', element: <CreateSpot /> },
      { path: '/spots/current', element: <ManageSpots /> },
      { path: '/spots/:spotId', element: <SpotDetails /> },
      { path: '/spots/:spotId/edit', element: <UpdateSpot /> },
      { path: '/reviews/current', element: <ManageReviews /> },
      { path: '*', element: <h1>Page Not Found</h1> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
