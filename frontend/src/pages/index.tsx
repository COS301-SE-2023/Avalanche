import Image from 'next/image'
import Link from 'next/link';
import Head from 'next/head'
import { useState, } from 'react';
import React from 'react';
import { SubmitButton, DangerAlert, Input, InputLabel, Anchor } from '@/components/Util';
import tempLogo from '../assets/logo.png';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userState, login } from '@/store/Slices/userSlice';
import { ILoginRequest } from '@/interfaces/requests';
import { useRouter } from 'next/router';
import LoadingPage from '@/components/Util/Loading';

export default function Home() {
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
  if (stateUser.login.success && !stateUser.login.error) {
    router.push("/dashboard");
    return <LoadingPage />
  } else
    return (
      <>
        <Toaster />
        <Head>
          <title>Avalanche</title>
        </Head>
        <section className="bg-gray-50 dark:bg-primaryBackground">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <Image src={tempLogo} className="w-10 h-10 mr-2" alt="Logo" />
              Avalanche Analytics
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-secondaryBackground dark:border-primaryBackground">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={(event) => formSubmit(event)}>
                  <div>
                    <InputLabel htmlFor="email" text="Your email" />
                    <Input type="email" name="email" id="email" placeholder="name@company.com" required={true} value={email} onChange={(event: React.FormEvent<HTMLInputElement>) => setEmail(event.currentTarget.value)} />
                    {emailError && <DangerAlert title="Invalid Email!" text="This email is invalid." />}
                  </div>
                  <div>
                    <InputLabel htmlFor="password" text="Password" />
                    <Input type="password" placeholder="••••••••" id="password" name="password" required={true} value={password} onChange={(event: React.FormEvent<HTMLInputElement>) => setPassword(event.currentTarget.value)} />
                    {passwordError && <DangerAlert title="Invalid Password!" text="This password is invalid." />}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                      </div>
                    </div>
                    {/* <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a> */}
                    <Anchor href="/forgot" text="Forgot password" customFont="text-sm" />
                  </div>
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
