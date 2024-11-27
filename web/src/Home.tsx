import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface HomeProps {
  goToShowCreatedTest: (testId: string) => void;
}

const Home: React.FC<HomeProps> = ({ goToShowCreatedTest }) => {
  const [joinCode, setJoinCode] = useState('');

  const handleJoinClick = () => {
    if (joinCode.trim()) {
      console.log('Joining with code:', joinCode);
      //TODO: join test jika bukan creator
      goToShowCreatedTest(joinCode);
    }
  };

  return (
    <div className="text-center min-w-[30%]">
      <Card className="w-full max-w-lg p-8">
        <Input
          placeholder="Enter a join code"
          className="mb-4"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <Button className="w-full mb-4" onClick={handleJoinClick}>
          Join
        </Button>
        <div className="text-primary font-medium mb-4">or</div>
        <Button variant="secondary" className="w-full">
          Join with QR Code
        </Button>
      </Card>
    </div>
  );
};

export default Home;