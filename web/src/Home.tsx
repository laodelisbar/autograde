import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function Home() {
  return (
    
    <div className="text-center min-w-[30%]">
      <Card className="w-full max-w-lg p-8">
        <Input placeholder="Enter a join code" className="mb-4" />
        <Button className="w-full mb-4">Join</Button>
        <div className="text-primary font-medium mb-4">or</div>
        <Button variant="secondary" className="w-full">Join with QR Code</Button>
      </Card>
    </div>
  );
}
export default Home;