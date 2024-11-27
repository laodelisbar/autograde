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
  
import { BiArrowBack } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi'; // Import ikon logout dari react-icons

const Profile: React.FC<{ goToHome: () => void }> = ({ goToHome }) => {
  const [profile, setProfile] = useState<any>(null);
  const [createdtestsResponse, setCreatedTests] = useState<any[]>([]);
  const [pasttestsResponse, setPastTests] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await getUserProfile(token);
          setProfile(response.data);

          const createdtestsResponse = await getTests(token);
          setCreatedTests(createdtestsResponse.data.message);

          //TODO: Ubah agar mencari test yang sudah dilkukan oleh user
          const pasttestsResponse = await getTests(token);
          setPastTests(pasttestsResponse.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    goToHome();
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

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
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile.profilePictureUrl || "https://picsum.photos/200"} alt="User Avatar" />
            <AvatarFallback className="text-4xl">{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-primary text-3xl font-bold text-center">{profile.username}</h2>
        <p className="text-primary text-center">{profile.email}</p>
      </div>
      <div className="w-full flex flex-col gap-4 sm:flex-row">
        <div className="w-full">
          <h2 className="text-primary text-xl font-medium text-center">Your Created Tests</h2>
          <div className="mt-4 flex flex-col gap-4">
            {createdtestsResponse.map((test) => (
              <Card key={test.id} className="w-full max-w-lg p-8">
                <p className="text-primary text-xl font-medium">{test.testTitle}</p>
              </Card>
            ))}
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-primary text-xl font-medium text-center">Your Past Tests</h2>
          <div className="mt-4 flex flex-col gap-4">
            {pasttestsResponse.map((test) => (
              <Card key={test.id} className="w-full max-w-lg p-8">
                <p className="text-primary text-xl font-medium">{test.testTitle}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;