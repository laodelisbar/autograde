import React, { useEffect, useState } from 'react';
import { showPastTest } from './api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ShowPastTestProps {
  testId: string;
  goToHome: () => void;
}

const ShowPastTest: React.FC<ShowPastTestProps> = ({ testId, goToHome }) => {
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await showPastTest(token, testId);
          console.log('Test Response:', response);
          setTest(response.data);
        }
      } catch (error) {
        console.error('Error fetching past test:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!test) {
    return <p>Test not found</p>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-8">
      <h1 className="text-4xl text-primary font-bold mb-4 text-center">{test.testTitle}</h1>
      <h2 className="text-5xl text-primary font-bold mb-4 text-center">{test.totalGrade}</h2>
      <div className="w-full flex flex-col items-center gap-4">
        <h2 className="text-2xl text-primary font-bold mb-2 text-center">Answers</h2>
        {test.results.map((result: any, index: number) => (
          <Card key={index} className="w-full p-4 flex justify-between">
            <div className="w-full flex flex-col">
                <h3 className="text-2xl text-primary font-bold text-start break-words">Question:</h3>
                <p className="text-xl text-primary text-start break-words">{result.question}</p>
                <h3 className="text-2xl text-primary font-bold text-start break-words mt-2">Answer:</h3>
                <p className="text-xl text-primary text-start break-words">{result.answer}</p>
            </div>
            <div className="flex flex-col justify-center p-4">
                <h3 className="text-5xl text-primary font-bold text-center">{result.grade}</h3>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={goToHome}>Go to Home</Button>
      </div>
    </div>
  );
};

export default ShowPastTest;