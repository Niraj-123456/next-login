"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth, db, googleProvider } from "../../utils/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { CircleCheckBig } from "lucide-react";
import { useUserContext } from "@next/context/UserContext";

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

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24"
    height="24"
    viewBox="0 0 48 48"
  >
    <path
      fill="#fbc02d"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#e53935"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4caf50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1565c0"
      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserContext();
  const registrationSuccess =
    Boolean(searchParams.get("registrationSuccess")) ?? false;
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [loggingInWithGoogle, setLoggingInWithGoogle] =
    useState<boolean>(false);
  const [loginError, setLoginError] = useState({
    hasError: false,
    errorMsg: "",
  });
  const { register, handleSubmit, formState } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  const { errors } = formState;

  const handleLoginWithEmailAndPassword: SubmitHandler<Login> = async (
    data
  ) => {
    const { email, password } = data;
    setLoggingIn(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const accessToken = await user.getIdToken();
      setLoggingIn(false);
      setCookie(
        "user-session",
        JSON.stringify({
          uuid: user.uid,
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          accessToken,
          SignedIn: true,
        })
      );
      router.push("/dashboard");
    } catch (err: any) {
      setLoggingIn(false);
      setLoginError({
        hasError: true,
        errorMsg: err?.message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoggingInWithGoogle(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);

      if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          authProvider: "google",
        });
      }
      const accessToken = await user.getIdToken();
      setLoggingInWithGoogle(false);
      router.push("/dashboard");
      setCookie(
        "user-session",
        JSON.stringify({
          uuid: user.uid,
          name: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          accessToken,
          SignedIn: true,
        })
      );
    } catch (err) {
      setLoggingInWithGoogle(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="w-full h-full grid place-items-center">
      <div className="flex flex-col gap-8">
        <h4 className="text-4xl text-center font-bold">Login</h4>
        <div className="border-2 border-white/40 p-10 rounded-md w-[485px] min-w-[485px]">
          {registrationSuccess && (
            <div className="bg-green-700 py-2 px-3 mb-4 rounded-md text-sm flex gap-2 items-center">
              <CircleCheckBig className="w-5 h-5" />
              <p>Registration successfully. Please Login to continue...</p>
            </div>
          )}
          <form onSubmit={handleSubmit(handleLoginWithEmailAndPassword)}>
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
                disabled={loggingIn}
                type="submit"
                className="flex items-center justify-center gap-4 p-2 bg-white/80 rounded-sm w-full text-gray-800 font-semibold transition-all duration-200 ease-in-out hover:bg-white/70"
              >
                Login
                {loggingIn && (
                  <div className="w-6">
                    <div className="loader"></div>
                  </div>
                )}
              </button>
            </div>
            <div className="text-center text-sm mt-4">
              <p>
                Don&apos;t have account?{" "}
                <span>
                  <Link
                    href="/register"
                    className="underline cursor-pointer hover:opacity-85"
                  >
                    Register
                  </Link>
                </span>
              </p>
            </div>
          </form>

          <div className="mt-6">
            <div className="flex items-center justify-center w-full gap-2">
              <div className="border w-10 border-gray-500" />
              <p className="text-center text-sm text-gray-500">or sigin with</p>
              <div className="border w-10 border-gray-500" />
            </div>
            <div className="mt-4">
              <button
                disabled={loggingInWithGoogle}
                onClick={handleGoogleLogin}
                className="text-white flex items-center gap-4 justify-center p-2 border border-gray-500 rounded-sm w-full font-semibold transition-all duration-200 ease-in-out hover:border-gray-300 disabled:border-gray-700 disabled:text-white/50"
              >
                <div>{GoogleIcon()}</div>
                <div>Sign in with Google</div>
                {loggingInWithGoogle && (
                  <div className="w-6">
                    <div className="loader"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
