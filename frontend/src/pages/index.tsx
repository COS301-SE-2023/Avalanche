import Image from 'next/image'
import Link from 'next/link';
import Head from 'next/head'
import { useState, useEffect } from 'react';
import React from 'react';
import { SubmitButton, DangerAlert, Input, InputLabel, Anchor, ErrorToast } from '@/components/Util';
import lightBanner from '../assets/images/light-banner.png';
import darkBanner from '../assets/images/dark-banner.png';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userState, login, clearError, clearLoading } from '@/store/Slices/userSlice';
import { ILoginRequest } from '@/interfaces/requests';
import { useRouter } from 'next/router';
import LoadingPage from '@/components/Util/Loading';
import { getCookie } from 'cookies-next';
import { useTheme } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex: RegExp = /"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$"/;

  const dispatch = useDispatch<any>();
  const stateUser = useSelector(userState);
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    if (!validate) return;

    const data: ILoginRequest = {
      email, password
    }

    dispatch(login({
      email, password,
    } as ILoginRequest));

  }

  useEffect(() => {
    dispatch(clearLoading());
  }, [])

  useEffect(() => {
    if (stateUser.requests.error) {
      switch (stateUser.requests.error) {
        case 'This user does not exist, please enter the correct email/please register.': {
          ErrorToast({ text: "The provided email/password do not match any registered user within our system." });
          break;
        }
        case 'Incorrect password': {
          ErrorToast({ text: "The provided email/password do not match any registered user within our system." });
          break;
        }
      }
      // ErrorToast({ text: `${stateUser.requests.error}` });
      dispatch(clearError());
    }

  }, [stateUser.requests]);

  const validate = (): boolean => {
    if (!email || !password) {
      if (!email) {
        setEmailError("The email your provided is invalid.");
      }

      if (!password) {
        setPasswordError("The password you provided is invalid.");
      }

      return false;
    }
    return true;
  }
  if (getCookie("jwt")) {
    router.push("/home");
    return <LoadingPage />
  } else
    return (
      <>
        <Toaster />
        <Head>
          <title>Avalanche</title>
        </Head>
        <section className="bg-gray-50 dark:bg-dark-background">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
            {/* {theme === "dark" ? <Image src={lightBanner} className="w-full sm:max-w-lg mb-2" alt="Logo" /> : <Image src={darkBanner} className="w-full sm:max-w-lg mb-2" alt="Logo" />} */}
            <Image src={darkBanner} className="w-full sm:max-w-lg mb-2" alt="Logo" />
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-secondaryBackground dark:border-primaryBackground">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={(event) => formSubmit(event)}>
                  <div>
                    <InputLabel htmlFor="email" text="Email" />
                    <Input type="email" name="email" id="email" placeholder="michael@dundermifflin.com" required={true} value={email} onChange={(event: React.FormEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)} />
                    {emailError && <DangerAlert title="Invalid Email!" text="This email is invalid." />}
                  </div>
                  <div>
                    <InputLabel htmlFor="password" text="Password" />
                    <Input type="password" placeholder="••••••••" id="password" name="password" required={true} value={password} onChange={(event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)} />
                    {passwordError && <DangerAlert title="Invalid Password!" text="This password is invalid." />}
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <Anchor href="/forgot" text="Forgot password" customFont="text-sm" />
                  </div> */}
                  <SubmitButton text="Sign in" onClick={() => null} loading={stateUser.loading} disabled={stateUser.loading} className="w-full" />
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don&apos;t have an account yet? <Link href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    )
}
