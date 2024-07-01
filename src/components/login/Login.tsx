"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth } from "../../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
    })
    .email({ message: "Email must be valid email." }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be atleast 8 characters long." })
    .max(16, {
      message: "Password must be less than or equal to 16 characters.",
    }),
});

type Login = z.infer<typeof LoginSchema>;

const Login = () => {
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState({
    hasError: false,
    errorMsg: "",
  });
  const { register, handleSubmit, formState } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  const { errors } = formState;

  const handleLogin: SubmitHandler<Login> = async (data) => {
    const { email, password } = data;
    setLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggingIn(false);
    } catch (err: any) {
      setLoggingIn(false);
      setLoginError({
        hasError: true,
        errorMsg: err?.message,
      });
    }
  };

  return (
    <div className="w-full h-full grid place-items-center">
      <div className="flex flex-col gap-8">
        <h4 className="text-4xl text-center font-bold">Login</h4>
        <div className="border-2 border-white/40 p-10 rounded-md w-[485px] min-w-[485px]">
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-gray-400">
                Email
              </label>
              <input
                className={`p-2 rounded-sm text-gray-700 ${
                  errors.email ? "ring-2 ring-red-500" : ""
                } focus-visible:ring-2 ${
                  errors?.email
                    ? "focus-visible:ring-red-500"
                    : "focus-visible:ring-sky-500"
                }`}
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors?.email && (
                <div className="text-xs text-red-500">
                  {errors?.email?.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label htmlFor="password" className="text-sm text-gray-400">
                Password
              </label>
              <input
                className={`p-2 rounded-sm text-gray-700 ${
                  errors?.password ? "ring-2 ring-red-500" : ""
                } focus-visible:ring-2 ${
                  errors?.password
                    ? "focus-visible:ring-red-500"
                    : "focus-visible:ring-sky-500"
                }`}
                placeholder="Enter your password"
                type={"password"}
                {...register("password")}
              />
              {errors?.password && (
                <div className="text-xs text-red-500">
                  {errors?.password?.message}
                </div>
              )}
            </div>
            <div className="mt-4">
              <input type="checkbox" />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-400"
              >
                Remember Me
              </label>
            </div>

            {loginError?.hasError && (
              <div className="w-full p-2 bg-red-400 border border-red-500 rounded-sm mt-4 text-sm">
                {loginError?.errorMsg}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="p-2 bg-white/80 rounded-md w-full text-gray-800 font-semibold transition-all duration-200 ease-in-out hover:bg-white/70"
              >
                Login
              </button>
            </div>
            <div className="text-center text-sm mt-4">
              <p>
                Don&apos;t have account?{" "}
                <span>
                  <a
                    href="#"
                    className="underline cursor-pointer hover:opacity-85"
                  >
                    Register
                  </a>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
