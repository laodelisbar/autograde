"use client"

import React, { useEffect, useState } from 'react';
import { getUserProfile, getTests } from './api';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton";
import { BiArrowBack } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi'; // Import ikon logout dari react-icons

const Profile: React.FC<{ goToHome: () => void, goToShowCreatedTest: (id: string) => void }> = ({ goToHome, goToShowCreatedTest }) => {
  const [profile, setProfile] = useState<any>(null);
  const [createdtestsResponse, setCreatedTests] = useState<any[]>([]);
  const [pasttestsResponse, setPastTests] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCreatedTests, setLoadingCreatedTests] = useState(true);
  const [loadingPastTests, setLoadingPastTests] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          setLoadingProfile(true);
          const response = await getUserProfile(token);
          setProfile(response.data);
          setLoadingProfile(false);

          setLoadingCreatedTests(true);
          const createdtestsResponse = await getTests(token);
          setCreatedTests(createdtestsResponse.data.tests);
          setLoadingCreatedTests(false);

          //TODO: Ubah agar mencari test yang sudah dilkukan oleh user
          setLoadingPastTests(true);
          const pasttestsResponse = await getTests(token);
          setPastTests(pasttestsResponse.data.tests);
          setLoadingPastTests(false);
        }
      } catch (error) {
        console.error(error);
        setLoadingProfile(false);
        setLoadingCreatedTests(false);
        setLoadingPastTests(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    goToHome();
  };

  return (
    <div className="min-h-screen w-full p-8 relative">
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
            <TooltipTrigger onClick={handleLogout}>
              <FiLogOut size={24} className="text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="text-center min-w-[30%]">
        <div className="flex justify-center mt-12">
          {loadingProfile ? (
            <Skeleton className="w-32 h-32 rounded-full" />
          ) : (
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.profilePictureUrl || "https://picsum.photos/200"} alt="User Avatar" />
              <AvatarFallback className="text-4xl">{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
        </div>
        {loadingProfile ? (
          <>
            <Skeleton className="mt-4 w-48 h-8 mx-auto" />
            <Skeleton className="mt-2 w-64 h-6 mx-auto" />
          </>
        ) : (
          <>
            <h2 className="text-primary text-3xl font-bold text-center">{profile.username}</h2>
            <p className="text-primary text-center">{profile.email}</p>
          </>
        )}
      </div>
      <div className="w-full flex flex-col gap-4 sm:flex-row">
        <div className="w-full">
          <h2 className="text-primary text-xl font-medium text-center">Your Created Tests</h2>
          <div className="mt-4 flex flex-col gap-4">
            {loadingCreatedTests ? (
              [...Array(3)].map((_, index) => (
                <Skeleton key={index} className="w-full max-w-lg h-24 mx-auto" />
              ))
            ) : (
              createdtestsResponse.map((test) => (
                <Card 
                  key={test.id} 
                  className="w-full max-w-lg p-8 cursor-pointer hover:bg-gray-100"
                  onClick={() => goToShowCreatedTest(test.id)}
                >
                  <p className="text-primary text-xl font-medium">{test.testTitle}</p>
                </Card>
              ))
            )}
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-primary text-xl font-medium text-center">Your Past Tests</h2>
          <div className="mt-4 flex flex-col gap-4">
            {loadingPastTests ? (
              [...Array(3)].map((_, index) => (
                <Skeleton key={index} className="w-full max-w-lg h-24 mx-auto" />
              ))
            ) : (
              pasttestsResponse.map((test) => (
                <Card key={test.id} className="w-full max-w-lg p-8">
                  <p className="text-primary text-xl font-medium">{test.testTitle}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;