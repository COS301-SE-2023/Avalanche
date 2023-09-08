import Image from 'next/image'
import Link from 'next/link';
import Head from 'next/head'
import { useState, useEffect } from 'react';
import React from 'react';
import { SubmitButton, DangerAlert, Input, InputLabel, Anchor, ErrorToast } from '@/components/Util';
import tempLogo from '../assets/logo.png';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { ILoginRequest } from '@/interfaces/requests';
import { useRouter } from 'next/router';
import LoadingPage from '@/components/Util/Loading';
import { getCookie } from 'cookies-next';

export default function Home() {
  const emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex: RegExp = /"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$"/;

  const dispatch = useDispatch<any>();
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
  
  router.push("/home");
  return <LoadingPage />
 
}
