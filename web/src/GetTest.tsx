// src/pages/GetTest.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { getTestById, startTest } from '@/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BiArrowBack, BiGroup, BiMenuAltLeft, BiTime } from 'react-icons/bi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AxiosError } from 'axios';

interface GetTestProps {
  testId: string;
  goToHome: () => void;
  goToLogin: () => void;
  onTestStart: (Test: any, userTestId: string) => void;
  goToProfile: () => void;
}

const GetTest: React.FC<GetTestProps> = ({ testId, goToHome, goToLogin, onTestStart, goToProfile }) => {
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await getTestById(testId);
        console.log('Response: ', response);
        setTest(response.test);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTest(); // Initial fetch
  
    const intervalId = setInterval(fetchTest, 5000); // Fetch every 5 seconds
  
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [testId]);

  const handleStartTest = async () => {
    setConfirmLoading(true);
    try {
      const requestData = { testId, username: username || undefined };
      const response = await startTest(requestData);
      onTestStart(response.data.test, response.data.userTestId);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, { duration: 1000 });
      } else {
        toast.error("An unknown error occurred.", { duration: 1000 });
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full p-8 text-primary">
        <div className="absolute top-4 left-4 p-2 rounded-full">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <div className="absolute top-4 right-4 p-2 rounded-full">
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
        <div className="w-full mt-12 flex flex-col justify-center items-center">
          <Skeleton className="w-full max-h-[200px] h-48 mb-4" />
          <Skeleton className="w-48 h-12 mb-4" />
          <div className="w-full md:w-[50%] grid grid-cols-3 gap-4 mb-4">
            <Skeleton className="w-full h-24 col-span-1" />
            <Skeleton className="w-full h-24 col-span-1" />
            <Skeleton className="w-full h-24 col-span-1" />
          </div>
          <Skeleton className="w-full md:w-[50%] h-12 mb-4" />
        </div>
      </div>
    );
  }

  if (!test) {
    return <div>Test not found</div>;
  }

  const jwtToken = localStorage.getItem('jwtToken');
  const storedUsername = localStorage.getItem('username');

  return (
    <div className="min-h-screen w-full p-8 text-primary">
      <div className="absolute top-4 left-4 p-2 rounded-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={goToHome}>
              <BiArrowBack size={24} className="text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="absolute top-4 right-4 p-2 rounded-full">
        {!jwtToken ? (
          <Button onClick={goToLogin}>Login</Button>
        ) : (
          <Avatar onClick={goToProfile} className="cursor-pointer">
            <AvatarImage src="https://picsum.photos/200" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className='w-full min-h-full mt-12 flex flex-col justify-center items-center'>
        <div className="w-full items-center rounded-lg overflow-hidden mb-4">
          <img src="https://picsum.photos/200" alt="photo" className="w-full max-h-[200px] object-cover" />
        </div>
        <h2 className="text-4xl text-primary font-bold mb-4 text-center">{test.testTitle}</h2>
        <div className="w-full md:w-[50%] grid grid-cols-3 gap-4 mb-4">
          <Card className="p-4 col-span-1 flex flex-col items-center text-center">
            <BiTime size={48} className="text-primary mb-2" />
            <p>{test.testDuration / 60} minutes</p>
          </Card>
          <Card className="p-4 col-span-1 flex flex-col items-center">
            <BiMenuAltLeft size={48} className="text-primary mb-2" />
            <p>{test.questionCount} Number</p>
          </Card>
          <Card className="p-4 col-span-1 flex flex-col items-center">
            <BiGroup size={48} className="text-primary mb-2" />
            <p>{test.UserTestCount} Users</p>
          </Card>
          {jwtToken && storedUsername && (
            <Card className="p-4 col-span-3">
              <h3>{storedUsername}</h3>
            </Card>
          )}
        </div>
        <div className="w-full md:w-[50%]">
          {!jwtToken && (
            <div className="mb-4">
              <Input id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          )}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                type="button" 
                className="w-full mb-4" 
                onClick={() => setShowDialog(true)} 
                disabled={!test.acceptResponses}
              >
                Start Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Confirm Start Test</DialogTitle>
              <DialogDescription>
                Are you sure you want to start the test?
              </DialogDescription>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button onClick={handleStartTest} disabled={confirmLoading}>
                  {confirmLoading && <Loader2 className="animate-spin mr-2" />}
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default GetTest;