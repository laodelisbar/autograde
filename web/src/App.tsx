import React, { useState } from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';
import MakeTest from './MakeTest';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'register':
        return <Register goToHome={() => setCurrentPage('home')} goToLogin={() => setCurrentPage('login')} />;
      case 'login':
        return <Login goToHome={() => setCurrentPage('home')} goToRegister={() => setCurrentPage('register')} />;
      case 'profile':
        return <Profile goToHome={() => setCurrentPage('home')} />;
      case 'makeTest':
        return <MakeTest goToHome={() => setCurrentPage('home')} goToProfile={() => setCurrentPage('profile')} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {currentPage === 'home' && (
        <Navbar goToHome={() => setCurrentPage('home')} goToLogin={() => setCurrentPage('login')} goToProfile={() => setCurrentPage('profile')} goToMakeTest={() => setCurrentPage('makeTest')} />
      )}
      <div className="flex-grow flex items-center justify-center">
        {renderPage()}
      </div>
    </div>
  );
}

function Navbar({ goToHome, goToLogin, goToProfile, goToMakeTest }: { goToHome: () => void, goToLogin: () => void, goToProfile: () => void, goToMakeTest: () => void }) {
  const token = localStorage.getItem('jwtToken');

  return (
    <div className="flex justify-between items-center p-4 bg-primary text-white">
      {token ? (
        <Button variant="secondary" onClick={goToMakeTest}>Make Test</Button>
      ) : <h1 className="text-3xl font-bold">Autograde</h1>}
      {token ? (
        <Avatar onClick={goToProfile} className="cursor-pointer">
          <AvatarImage src="https://picsum.photos/200" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ) : (
        <Button variant="secondary" onClick={goToLogin}>Login</Button>
      )}
    </div>
  );
}

export default App;