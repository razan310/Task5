import { Outlet, NavLink, useNavigate } from "react-router-dom";
import logo from './../../assets/img/dashbordLogo.svg';
import vector from './../../assets/img/Vector.svg';
import markbook1 from './../../assets/img/bookmark.svg';
import logout from './../../assets/img/sign-out-alt 1.svg'
import { useEffect } from 'react';

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
    }
  }, [token, navigate]);

  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  const profileImageUrl = localStorage.getItem('profile_image_url');
  const userName = localStorage.getItem('user_name');

  return (
    <>
      <div className="bg-my-ofWhite md:w-18.75 h-screen flex flex-col items-center justify-between">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="my-5" />
          <div className="flex flex-col items-center mb-12">
            {profileImageUrl && <img src={profileImageUrl} alt="User" className="h-[148px] w-[148px] mt-10 rounded-full" />}
            <h1 className="font-bold text-base capitalize my-3">{firstName} {lastName}</h1>
            <p>{userName}</p>
          </div>
          <div className="max-h-98.3 w-48">
            <ul className="grow h-full w-48 justify-center">
              <li className="h-full flex flex-col items-center justify-between font-medium text-sm w-48">
                <div className="flex flex-col items-center w-48">
                  <NavLink 
                    to="/showall" 
                    className={({ isActive }) => (isActive ? "mb-2 flex flex-row items-center gap-3 active bg-my-yello h-10 w-48 rounded justify-center " : "mb-2 flex flex-row items-center gap-3 h-10 w-48 justify-center")}
                  >
                    <img src={vector} alt="Products" /> Products
                  </NavLink>
                  <NavLink 
                    to="/favorites" 
                    className={({ isActive }) => (isActive ? "mb-2 flex flex-row items-center justify-center gap-3 h-10 active bg-my-yello rounded w-48" : "mb-2 flex flex-row justify-center items-center gap-3 h-10 w-48")}
                  >
                    <img src={markbook1} alt="Favorites" /> Favorites
                  </NavLink>
                  <NavLink 
                    to="/orderList" 
                    className={({ isActive }) => (isActive ? "mb-2 flex flex-row gap-3 items-center justify-center active bg-my-yello rounded h-10 w-48" : "mb-2 flex flex-row items-center justify-center gap-3 h-10 w-48")}
                  >
                    <img src={markbook1} alt="Order List" /> Order List
                  </NavLink>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <NavLink 
          to="/logout" 
          className="mb-2 flex flex-row gap-6"
        >
          Logout 
          <img src={logout} alt="logout"/>
        </NavLink>
      </div>
      <Outlet />
    </>
  );
}

export default Dashboard;
