"use client"

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { loginUser } from './api';

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Login: React.FC<{ goToHome: () => void, goToRegister: () => void }> = ({ goToHome, goToRegister }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await loginUser(data.email, data.password);
      setSuccessMessage(response.data.message);
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('username', response.data.username);
      console.log(response.data);
      goToHome();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center min-w-[30%]">
        <div className="text-primary p-4 cursor-pointer" onClick={goToHome}>
          <h1 className="text-3xl font-bold">Autograde</h1>
        </div>
        <Card className="w-full max-w-md p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col w-full">
                <Button type="submit">Login</Button>
                <div className="text-primary font-medium">or</div>
                <Button variant="secondary" onClick={goToHome}>Login With Google</Button>
                <p className="text-primary p-4">
                  Don't have an account?
                  <strong className="text-md font-bold cursor-pointer" onClick={goToRegister}> Register</strong>
                </p>
              </div>
            </form>
          </Form>
          {successMessage && (
            <div className="mt-4 text-green-600">
              {successMessage}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;