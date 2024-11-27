import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TestResultProps {
  TestResult: any;
  goToHome: () => void;
}

const TestResult: React.FC<TestResultProps> = ({ TestResult, goToHome }) => {
  return (
    <div className="min-h-screen w-full flex flex-col p-8">
      <h1 className="text-4xl text-primary font-bold mb-4 text-center">{TestResult.testTitle}</h1>
      <h2 className="text-5xl text-primary font-bold mb-4 text-center">{TestResult.totalGrade}</h2>
      <div className="w-full flex flex-col items-center gap-4">
        <h2 className="text-2xl text-primary font-bold mb-2 text-center">Answers</h2>
        {TestResult.results.map((result: any, index: number) => (
          <Card key={index} className="w-full p-4 flex justify-between">
            <h3 className="text-2xl text-primary font-bold text-start break-words">{result.answer.answer}</h3>
            <h3 className="text-5xl text-primary font-bold text-center">{result.answer.grade}</h3>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={goToHome}>Go to Home</Button>
      </div>
    </div>
  );
};

export default TestResult;