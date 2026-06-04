"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, ShieldCheck, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { registerSchema } from "../Schema";
import { useRegister } from "../api/use-register";
import { toast } from "sonner";


type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {mutate}=useRegister()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = watch("password", "");

  const passwordRequirements = [
    { label: "At least 8 characters", met: passwordValue.length >= 8 },
    { label: "Contains a number or symbol", met: /[0-9!@#$%^&*(),.?":{}|<>_]/.test(passwordValue) },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      console.log(data);
      mutate({json:data},{
        onSuccess:()=>{
          toast.success("create the account")
        },
        onError:()=>{
          toast.error("something is wrong wait and try letter" )
        }
        
      })
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      console.log(`Registering with ${provider}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r border-neutral-800 bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative z-20 flex items-center gap-2 text-lg font-medium tracking-tight">
          <div className="h-8 w-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center">
            <span className="text-sm font-bold text-white">pL</span>
          </div>
          <span className="font-semibold text-neutral-100 tracking-tight">planLab</span>
        </div>

        <div className="relative z-20 my-auto flex flex-col items-center justify-center w-full max-w-xl mx-auto">
          <div className="w-full aspect-[4/3] relative rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 backdrop-blur-sm shadow-2xl">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
            <Image 
              src="/img.svg" 
              alt="planLab Dashboard Analytics" 
              fill
              priority
              className="object-cover rounded-lg opacity-85 select-none pointer-events-none" 
            />
          </div>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-light leading-relaxed text-neutral-400">
              Centralizing our issue tracking and production metrics in planLab has shaved weeks off our development delivery cycles.
            </p>
            <footer className="text-sm font-medium text-neutral-200">Director of Product, SyncLoop</footer>
          </blockquote>
        </div>
      </div>

      <div className="lg:p-8 flex items-center justify-center w-full min-h-screen lg:min-h-0 bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] p-4 sm:p-0">
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
            <CardHeader className="space-y-1.5 pt-6 px-6">
              <div className="flex justify-center lg:hidden mb-4">
                <div className="h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <span className="text-base font-bold text-white">pL</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-center lg:text-left">
                Create an account
              </CardTitle>
              <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400 text-center lg:text-left">
                Get started with your free 14-day trial workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 px-6">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Full name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="h-10 border-neutral-200 dark:border-neutral-800 bg-transparent"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs font-medium text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="grid gap-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="h-10 border-neutral-200 dark:border-neutral-800 bg-transparent"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="h-10 pr-10 border-neutral-200 dark:border-neutral-800 bg-transparent"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
                  )}

                  {passwordValue && (
                    <div className="mt-2 space-y-1.5 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-100 dark:border-neutral-800/60 p-2 rounded-lg">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs">
                          {req.met ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-700 shrink-0" />
                          )}
                          <span className={req.met ? "text-neutral-700 dark:text-neutral-300" : "text-neutral-400"}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-10 mt-2 font-medium">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Account
                </Button>
              </form>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
                    Or register with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleOAuthLogin("google")}
                  className="h-10 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleOAuthLogin("github")}
                  className="h-10 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                    <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-24.1-4.2c-.3 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 5.9-2 .3-2-1.3-4.3-4.3-5.2-2.6-.7-5.5.3-5.9 2.3zm-15.6-7.2c-.5 1.6 1 3.5 3.6 4.1 2.6.7 5.6-.6 6-2.3.5-1.6-1-3.5-3.6-4.1-2.6-.7-5.5.6-6 2.3zm-11.5-11.4c-1-1.3-3-1-4.3 1-1.3 2.3-1 4.9 1 6.1 1.2 1.3 3.3.7 4.6-1.6 1.3-2.3 1-4.9-1-6.2zm-7.6-16.6c-1.3-.3-3.3.7-4.6 2.7-1.3 2-1 4.9 1 5.5 1.3.3 3.3-.7 4.6-2.7 1.4-2 1-4.9-1-5.5zm-5.4-18.4c-1.2-.6-3.7.3-4.3 2.3-.6 2.2 1.2 4.5 3.8 5.1( 2.3.6 4.8-.3 5.4-2.3.6-2.2-1.2-4.5-3.8-5.1zm-4.4-23.9c-1-1-3.1-.3-3.7 1.4-.6 1.8.6 4 2.6 4.7 2 1 4.2-.3 4.8-2 1.1-1.7-.3-3.8-2.3-4.1zm3.2-17c-1-1.3-3.6-1-4.6 1-1 2.1.3 4.6 2.7 5.3 2.3.7 4.8-1 5.6-3.1 1-2.2-1.3-4.6-2.7-4.3zm384 100.8c0-1.7-1.4-3-3.1-3-1.7 0-3 1.3-3 3 0 1.7 1.4 3 3 3 1.7 0 3-1.3 3-3zm-10.7 1.1c-.3 1.7 1.4 3.2 3.5 3.2 1.9.3 3.7-1.1 4.1-2.9.3-1.7-1.4-3.2-3.5-3.2-1.9-.3-3.7 1.1-4.1 2.9zm-24.4 3.1c-.9 1.7.6 3.7 3.2 4.3 2.6.6 5.1-.6 5.9-2.3.9-1.7-.6-3.7-3.2-4.3-2.6-.5-5.1.6-5.9 2.3zm-11.5-1.1c-1.6 1.3-1.6 3.6 0 4.9 1.5 1.3 3.8 1.3 5.3 0 1.5-1.3 1.5-3.6 0-4.9-1.5-1.3-3.8-1.3-5.3 0zM355.4 466c-1.2 1-1 3.6.3 5.3 1.3 1.6 3.9 1.6 5.1.3 1.2-1 1-3.6-.3-5.3-1.3-1.6-3.9-1.6-5.1-.3zm-14-11.4c-1.3 1-1.3 3.6.3 5.3 1.4 1.6 4 1.3 5.1-.3 1.2-1.7 1-4.3-.3-5.6-1.3-1-4-.7-5.1 1zM422 108.3C421 95.8 416.7 80 406.8 63.3c0 0-12.2-3.9-40 14.9-11.6-3.2-24-4.8-36.3-4.8-12.3 0-24.7 1.6-36.3 4.8-27.8-18.8-40-14.9-40-14.9-9.9 16.7-14.2 32.5-15.2 45-14.8 16.2-23.8 36.8-23.8 62.1 0 88.3 53.9 107.8 105 113.4-6.8 5.8-13 17.2-13 34.7 0 25.1-.2 45.4-.2 51.6 0 5 3.3 10.8 12.6 9C414.2 433.3 496 342.6 496 235.1c0-63.1-24.2-120.3-64-162.8z"></path>
                  </svg>
                  GitHub
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-6 px-6">
              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 w-full">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-neutral-900 dark:text-neutral-100 underline underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure, enterprise-grade authentication</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}