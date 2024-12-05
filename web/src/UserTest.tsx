import React, { useEffect, useState } from 'react';
import { showUserTestDetails, updateAnswerGrade } from './api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface UserTestProps {
  userTestId: string;
  goToHome: () => void;
}

const UserTest: React.FC<UserTestProps> = ({ userTestId, goToHome }) => {
  const [userTest, setUserTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserTestDetails = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const response = await showUserTestDetails(token, userTestId);
        console.log('User Test Details:', response.data);
        setUserTest(response.data.userTest);
      }
    } catch (error) {
      console.error('Error fetching user test details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTestDetails();
  }, [userTestId]);

  const handleGradeUpdate = async (answerId: string, grade: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        await updateAnswerGrade(token, answerId, grade);
        toast.success('Grade updated successfully', { duration: 1000 });
        fetchUserTestDetails();
      }
    } catch (error) {
      console.error('Error updating grade:', error);
      toast.error('Failed to update grade', { duration: 1000 });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userTest) {
    return <p>User test not found</p>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-8">
      <h1 className="text-4xl text-primary font-bold mb-4 text-center">{userTest.testTitle}</h1>
      <h2 className="text-5xl text-primary font-bold mb-4 text-center">{userTest.totalGrade}</h2>
      <div className="w-full flex flex-col items-center gap-4">
        <h2 className="text-2xl text-primary font-bold mb-2 text-center">Answers</h2>
        {userTest.answers.map((answer: any, index: number) => (
          <Card key={index} className="w-full p-4 flex justify-between">
            <div className="w-full flex flex-col">
              <h3 className="text-2xl text-primary font-bold text-start break-words">Question:</h3>
              <p className="text-xl text-primary text-start break-words">{answer.question.questionText}</p>
              <h3 className="text-2xl text-primary font-bold text-start break-words mt-2">Answer:</h3>
              <p className="text-xl text-primary text-start break-words">{answer.answer}</p>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((grade) => (
                  <Button
                    key={grade}
                    variant={answer.grade === grade ? 'default' : 'secondary'}
                    onClick={() => handleGradeUpdate(answer.id, grade)}
                  >
                    {grade}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center p-4">
              <h3 className="text-5xl text-primary font-bold text-center">{answer.grade}</h3>
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

export default UserTest;