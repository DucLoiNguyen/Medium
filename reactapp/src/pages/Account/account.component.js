import React, { useState } from 'react';

function Account() {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="App">
      <nav className="bg-white shadow-md">
        <div className="container flex items-center justify-between mx-auto">
          <a href="#" className="text-xl font-bold">Tên website</a>
          <button id="menu-button" className="inline-flex items-center p-2 text-gray-400 rounded-md hover:text-gray-600" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div id="menu" className={menuActive ? "block" : "hidden"} >
          <ul className="p-4">
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Account;
