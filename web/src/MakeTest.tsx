"use client"

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BiEraser, BiArrowBack } from 'react-icons/bi';
import { createTest } from './api';
import { Card } from './components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';

const formSchema = z.object({
  testTitle: z.string().min(1, { message: "Test title is required" }),
  testDuration: z.number().min(1, { message: "Test duration must be at least 1 minute" }),
  questions: z.array(
    z.object({
      questionText: z.string().min(1, { message: "Question text is required" }),
      answerText: z.string().min(1, { message: "Answer text is required" }),
    })
  ).min(1, { message: "At least one question is required" }),
});

interface MakeTestProps {
  goToHome: () => void;
  goToProfile: () => void;
  goToShowCreatedTest: (id: string) => void;
}

const MakeTest: React.FC<MakeTestProps> = ({ goToHome, goToProfile, goToShowCreatedTest }) => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testTitle: '',
      testDuration: 60,
      questions: [{ questionText: '', answerText: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const onSubmit = (data: any) => {
    setFormData(data);
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const response = await createTest(token, formData);
        reset();
        goToShowCreatedTest(response.data.test.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDialogOpen(false);
    }
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
                    <TooltipTrigger onClick={goToProfile} className="cursor-pointer">
                    <Avatar>
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
        <h2 className="text-2xl text-primary font-bold mb-4 mt-12">Create a New Test</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col gap-4 mt-4 sm:flex-row">
            <div className="w-full text-primary">
                <Button type="submit" className="mb-4">Create Test</Button>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Test Title</label>
                    <Controller
                    name="testTitle"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Test Title" />}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Test Duration (minutes)</label>
                    <Controller
                    name="testDuration"
                    control={control}
                    render={({ field }) => <Input type="number" {...field} placeholder="Test Duration" />}
                    />
                </div>
            </div>
            <div className="w-full">
                <label className="block text-primary text-lg font-medium mb-4">Questions</label>
                <div className="flex flex-col justify-start gap-4">
                    {fields.map((item, index) => (
                    <Card key={item.id} className="flex text-primary flex-col justify-center p-4">
                        <div>
                            <label className="block text-sm font-medium">Question</label>
                            <Controller
                                name={`questions.${index}.questionText`}
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Question" />}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Answer</label>
                            <Controller
                                name={`questions.${index}.answerText`}
                                control={control}
                                render={({ field }) => <Input {...field} placeholder="Answer" />}
                            />
                        </div>
                        <div className="pt-2 pb-0 flex justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger onClick={() => remove(index)}>
                                    <BiEraser size={24} className="text-destructive" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Remove Question</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        </div>
                    </Card>
                    ))}
                    <Button type="button" onClick={() => append({ questionText: '', answerText: '' })}>Add Question</Button>
                </div>
            </div>
        </div>
        </form>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Submission</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to submit this test?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default MakeTest;