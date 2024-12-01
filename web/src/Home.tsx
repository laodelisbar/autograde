import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface HomeProps {
  goToGetTest: (testId: string) => void;
}

const Home: React.FC<HomeProps> = ({ goToGetTest }) => {
  const [joinCode, setJoinCode] = useState('');
  const [showQrScanner, setShowQrScanner] = useState(false);

  const handleJoinClick = () => {
    if (joinCode.trim()) {
      console.log('Joining with code:', joinCode);
      goToGetTest(joinCode);
    }
  };

  const handleScan = (result: any) => {
    if (result) {
      const rawValue = result[0].rawValue;
      toast.success('Code scanned', { duration: 1000 });
      setShowQrScanner(false);
      goToGetTest(rawValue);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    if (err.name === 'NotReadableError') {
      toast.error('Could not start video source. Please ensure no other application is using the camera and try again.', { duration: 3000 });
    } else {
      toast.error('Failed to scan QR code'+ err, { duration: 3000 });
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
        <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="w-full" onClick={() => setShowQrScanner(true)}>
              Join with QR Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Please scan the QR code to join the test.
            </DialogDescription>
            <Scanner 
              onScan={handleScan} 
              onError={handleError} 
              classNames={{ container: 'mt-4' }}
              constraints={{ facingMode: 'environment' }} 
            />
            <DialogFooter>
              <Button onClick={() => setShowQrScanner(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default Home;