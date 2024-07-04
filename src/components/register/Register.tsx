"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@next/utils/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

const UserRegisterSchema = z
  .object({
    name: z.string({ required_error: "Name is required." }),
    email: z
      .string({ required_error: "Email is required." })
      .email({ message: "Email must be a valid email." }),
    password: z
      .string({ required_error: "Password is required." })
      .min(8, { message: "Password must be atleast 8 characters long." })
      .max(16, { message: "Password must be less than 16 characters." }),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password and Confirm password does not match.",
    path: ["confirmPassword"],
  });

type UserRegisterType = z.infer<typeof UserRegisterSchema>;

const Register = () => {
  const router = useRouter();
  const [registerInProcess, setRegisterInProcess] = useState<boolean>(false);
  const { register, handleSubmit, formState } = useForm<UserRegisterType>({
    resolver: zodResolver(UserRegisterSchema),
  });
  const { errors } = formState;

  const handleRegister: SubmitHandler<UserRegisterType> = async (data) => {
    const { name, email, password } = data;
    setRegisterInProcess(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        email,
        photoURL: user.photoURL,
        authProvider: "local",
      });
      setRegisterInProcess(false);
      router.replace("/?registrationSuccess=true");
    } catch (err) {
      setRegisterInProcess(false);
    }
  };
  return (
    <div className="w-full h-full grid place-items-center">
      <div className="flex flex-col gap-8">
        <h4 className="text-4xl text-center font-bold">Register</h4>
        <div className="border-2 border-white/40 p-10 rounded-md w-[485px] min-w-[485px]">
          <form onSubmit={handleSubmit(handleRegister)}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-gray-400">
                Username
              </label>
              <input
                className={`p-2 rounded-sm text-gray-700 ${
                  errors.name ? "ring-2 ring-red-500" : ""
                } focus-visible:ring-2 ${
                  errors?.name
                    ? "focus-visible:ring-red-500"
                    : "focus-visible:ring-sky-500"
                }`}
                placeholder="Enter your email"
                {...register("name")}
              />
              {errors?.name && (
                <div className="text-xs text-red-500">
                  {errors?.name?.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 mt-4">
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
            <div className="flex flex-col gap-2 mt-4">
              <label
                htmlFor="confirmPassword"
                className="text-sm text-gray-400"
              >
                Confirm Password
              </label>
              <input
                className={`p-2 rounded-sm text-gray-700 ${
                  errors?.confirmPassword ? "ring-2 ring-red-500" : ""
                } focus-visible:ring-2 ${
                  errors?.confirmPassword
                    ? "focus-visible:ring-red-500"
                    : "focus-visible:ring-sky-500"
                }`}
                placeholder="Enter your password"
                type={"password"}
                {...register("confirmPassword")}
              />
              {errors?.confirmPassword && (
                <div className="text-xs text-red-500">
                  {errors?.confirmPassword?.message}
                </div>
              )}
            </div>
            {/* 
            {loginError?.hasError && (
              <div className="w-full p-2 bg-red-400 border border-red-500 rounded-sm mt-4 text-sm">
                {loginError?.errorMsg}
              </div>
            )} */}

            <div className="mt-8">
              <button
                disabled={registerInProcess}
                type="submit"
                className="flex items-center justify-center gap-4 p-2 bg-white/80 rounded-sm w-full text-gray-800 font-semibold transition-all duration-200 ease-in-out hover:bg-white/70 disabled:bg-gray-600 disabled:text-gray-500"
              >
                Register
                {registerInProcess && (
                  <div className="w-6">
                    <div className="loader"></div>
                  </div>
                )}
              </button>
            </div>
            <div className="text-center text-sm mt-4">
              <p>
                Already have account?{" "}
                <span>
                  <Link
                    href="/"
                    className="underline cursor-pointer hover:opacity-85"
                  >
                    Login
                  </Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
