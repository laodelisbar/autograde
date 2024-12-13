import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BiBookmark } from 'react-icons/bi';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { submitTest } from '@/api';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from "sonner";

interface TakeTestProps {
  Test: any;
  userTestId: string;
  onTestSubmit: (TestResult: any) => void;
}

const TakeTest: React.FC<TakeTestProps> = ({ Test, userTestId, onTestSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Test.testDuration);
  const questions = Test.questions;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsDialogOpen(true);
          return 0;
        }
        const newTimeLeft = prevTime - 1;
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userTestId]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFlag = () => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    setFlaggedQuestions((prevFlaggedQuestions) =>
      prevFlaggedQuestions.includes(currentQuestionId)
        ? prevFlaggedQuestions.filter((id) => id !== currentQuestionId)
        : [...prevFlaggedQuestions, currentQuestionId]
    );
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    setAnswers({ ...answers, [currentQuestionId]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      userTestId,
      questions: Object.keys(answers).map((questionId) => ({
        questionId,
        answer: answers[questionId],
      })),
      timeLeft, // send the remaining time
    };

    setIsLoading(true);

    try {
      const response = await submitTest(payload);

      if (response.status === 200) {
        console.log('Test submitted:', response.data);
        onTestSubmit(response.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, { duration: 1000 });
      } else {
        toast.error("An unknown error occurred.", { duration: 1000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-8">
      <div className="absolute top-4 right-4 text-primary text-xl font-bold">
        {formatTime(timeLeft)}
      </div>
      <div className="flex-grow flex justify-center">
        <div className="flex flex-col w-full gap-4">
          <h1 className="text-4xl text-primary font-bold mb-4 text-center">{Test.testTitle}</h1>
          <h2 className="text-2xl text-primary font-medium mb-4 text-center break-words">{questions[currentQuestionIndex].questionText}</h2>
          <div className="w-full flex justify-center">
            <Textarea
              placeholder="Type your answer here..."
              className="w-full md:w-[50%] h-32 p-4 border rounded-md text-primary"
              value={answers[questions[currentQuestionIndex].id] || ''}
              onChange={handleAnswerChange}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-4 mt-4 gap-2">
        {questions.map((question: any, index: any) => (
          <Button
            key={question.id}
            variant={
              flaggedQuestions.includes(question.id)
                ? "warning"
                : index === currentQuestionIndex
                ? "default"
                : "secondary"
            }
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Prev
        </Button>
        <Button variant="warning" onClick={handleFlag}>
          <BiBookmark size={24} />
        </Button>
        <Button onClick={handleNext}>
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Finish Test</DialogTitle>
          <DialogDescription>
            Are you sure you want to finish the test? Once submitted, you cannot change your answers.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant={'secondary'}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin mr-2" />} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TakeTest;