import { useEffect, useState } from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';
import MakeTest from './MakeTest';
import ShowCreatedTest from './ShowCreatedTest';
import GetTest from './GetTest';
import TakeTest from './TakeTest';
import TestResult from './TestResult';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner"

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [testId, setTestId] = useState<string | null>(null);
  const [userTestId, setUserTestId] = useState<string | null>(null);
  const [Test, setTest] = useState<any | null>(null);
  const [testResult, setTestResult] = useState<{ totalGrade: any; questionGrades: any[]; } | null>(null);

  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentPage('login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home goToGetTest={(id: string) => { setTestId(id); setCurrentPage('getTest'); }} />;
      case 'register':
        return <Register goToHome={() => setCurrentPage('home')} goToLogin={() => setCurrentPage('login')} />;
      case 'login':
        return <Login goToHome={() => setCurrentPage('home')} goToRegister={() => setCurrentPage('register')} />;
      case 'profile':
        return <Profile goToHome={() => setCurrentPage('home')} goToShowCreatedTest={(id: string) => { setTestId(id); setCurrentPage('showCreatedTest'); }} />;
      case 'makeTest':
        return <MakeTest goToHome={() => setCurrentPage('home')} goToProfile={() => setCurrentPage('profile')} goToShowCreatedTest={(id: string) => { setTestId(id); setCurrentPage('showCreatedTest'); }} />;
      case 'showCreatedTest':
        return testId ? <ShowCreatedTest testId={testId} goToHome={() => setCurrentPage('home')} goToProfile={() => setCurrentPage('profile')} /> : <Home goToGetTest={(id: string) => { setTestId(id); setCurrentPage('showCreatedTest'); }} />;
      case 'getTest':
        return testId ? <GetTest testId={testId} goToHome={() => setCurrentPage('home')} goToLogin={() => setCurrentPage('login')} goToProfile={() => setCurrentPage('profile')} onTestStart={(Test: any, userTestId: string) => { setTest(Test); setUserTestId(userTestId); setCurrentPage('takeTest'); }} /> : <Home goToGetTest={(id: string) => { setTestId(id); setCurrentPage('getTest'); }} />;
      case 'takeTest':
        return Test && userTestId ? <TakeTest Test={Test} userTestId={userTestId} onTestSubmit={(testResult: any) => { setTestResult(testResult); setCurrentPage('testResult'); }} /> : <Home goToGetTest={(id: string) => { setTestId(id); setCurrentPage('getTest'); }} />;
      case 'testResult':
        return testResult ? <TestResult TestResult={testResult} goToHome={() => setCurrentPage('home')} /> : <Home goToGetTest={(id: string) => { setTestId(id); setCurrentPage('getTest'); }} />;
      default:
        return <Home goToGetTest={(id: string) => { setTestId(id); setCurrentPage('getTest'); }} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {currentPage === 'home' && (
        <Navbar goToLogin={() => setCurrentPage('login')} goToProfile={() => setCurrentPage('profile')} goToMakeTest={() => setCurrentPage('makeTest')} />
      )}
      <div className="flex-grow flex items-center justify-center">
        {renderPage()}
      </div>
      <Toaster />
    </div>
  );
}

function Navbar({ goToLogin, goToProfile, goToMakeTest }: { goToLogin: () => void, goToProfile: () => void, goToMakeTest: () => void }) {
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