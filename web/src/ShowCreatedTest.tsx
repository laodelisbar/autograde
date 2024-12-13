"use client"

import React, { useEffect, useState } from 'react';
import { showCreatedTest, updateAcceptResponses } from '@/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import QRCode from 'react-qr-code';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BiArrowBack } from 'react-icons/bi';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ShowCreatedTestProps {
  testId: string;
  goToHome: () => void;
  goToProfile: () => void;
  goToUserTest: (userTestId: string) => void;
}

const ShowCreatedTest: React.FC<ShowCreatedTestProps> = ({ testId, goToHome, goToProfile, goToUserTest }) => {
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  const [acceptResponses, setAcceptResponses] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await showCreatedTest(token, testId);
          setTest(response.data.test);
          setAcceptResponses(response.data.test.acceptResponses);
        } else {
            console.log("No token found");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to fetch test details");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleToggleAcceptResponses = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        toast.success((await updateAcceptResponses(token, testId, !acceptResponses)).data.message, { duration: 1000 });
        setAcceptResponses(!acceptResponses);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update accept responses");
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
          <Skeleton className="w-48 h-12 mb-4" />
          <div className="w-full mb-4 flex flex-col justify-start">
            <Skeleton className="w-full h-6 mb-2" />
            <Skeleton className="w-full h-6 mb-4" />
            <Skeleton className="w-32 h-10" />
          </div>
          <Tabs defaultValue="responses" className="w-full">
            <TabsList className="mb-4">
              <Skeleton className="w-24 h-8 mr-2" />
              <Skeleton className="w-24 h-8" />
            </TabsList>
            <TabsContent value="questions">
              <Skeleton className="w-full h-6 mb-4" />
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="w-full h-24 mb-4" />
              ))}
            </TabsContent>
            <TabsContent value="responses">
              <Skeleton className="w-full h-6 mb-4" />
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="w-full h-24 mb-4" />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  if (!test) {
    return <div>Test not found</div>;
  }

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={goToProfile}>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://picsum.photos/200" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className='w-full mt-12 flex flex-col justify-center items-center'>
        <h2 className="text-4xl text-primary font-bold mb-4 text-center">{test.testTitle}</h2>
        <div className="w-full mb-4 flex flex-col justify-start">
          <div>
            <p><strong>Duration:</strong> {test.testDuration / 60} minutes</p>
            <div className="flex items-center mb-4">
              <p className="mr-2"><strong>Accept Responses:</strong></p>
              <Switch checked={acceptResponses} onCheckedChange={handleToggleAcceptResponses} />
            </div>
            <Button onClick={() => setIsQrCodeOpen(true)}>Show QR Code</Button>
          </div>
        </div>
        <Tabs defaultValue="responses" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
          </TabsList>
          <TabsContent value="questions">
            <h3 className="text-lg font-medium mb-4">Questions</h3>
            {test.questions.map((question: any) => (
              <Card key={question.id} className="mb-4 p-4">
                <p><strong>Question:</strong> {question.questionText}</p>
                <p><strong>Answer:</strong> {question.answerText}</p>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="responses">
            <h3 className="text-lg font-medium mb-4">Responses</h3>
            {test.userTests.length > 0 ? (
              test.userTests.map((userTest: any) => (
                <Card key={userTest.id} className="mb-4 p-4 flex justify-between cursor-pointer hover:bg-gray-200" onClick={() => goToUserTest(userTest.id)}>
                  <div>
                    <p className='text-primary text-2xl font-bold'>{userTest.username}</p>
                  </div>
                  <div>
                    <p className='text-primary text-2xl font-bold'>{userTest.totalGrade}</p>
                  </div>
                </Card>
              ))
            ) : (
              <p>No responses yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={isQrCodeOpen} onOpenChange={setIsQrCodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">{test.testTitle}</DialogTitle>
          </DialogHeader>
          <QRCode value={testId} size={512} className="w-full" />
          <h3 className="text-primary text-xl font-bold text-center">{test.id}</h3>
          <DialogFooter>
            <Button onClick={() => setIsQrCodeOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShowCreatedTest;