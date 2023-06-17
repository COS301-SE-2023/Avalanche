import Head from 'next/head'
import { Anchor, Checkbox, Input, InputLabel, WarningAlert, ErrorToast, SubmitButton, SuccessToast } from '@/components/Util'
import { useState, useEffect } from 'react';
import tempLogo from '../assets/logo.png';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userState, register, resetRequest, otpVerify } from '@/store/Slices/userSlice';
import { IRegisterRequest, IOTPVerifyRequest } from '@/interfaces/requests';

export default function Register() {

    const dispatch = useDispatch<any>();
    const stateUser = useSelector(userState);

    useEffect(() => {
        dispatch(resetRequest());
    }, [])

    useEffect(() => {

        if (stateUser.requests.awaitingOTP && stateUser.requests.register) {
            setStep(2);
            SuccessToast({ text: `Please check the provided email address (${registerObject.email}) for an OTP.` })
        }

    }, [stateUser.requests.awaitingOTP]);

    useEffect(() => {
        if (stateUser.requests.otp) {
            if (stateUser.requests.error) {
                // handle errorc
                console.log("error");
                ErrorToast({ text: "Something went wrong" });
            } else if (stateUser.requests.message) {
                // handle success
                console.log("success");
                SuccessToast({ text: "You have successfully registered. You can login now." })
                setStep(3);
            }
        }
    }, [stateUser.requests.otp]);

    const initRegister = {
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        countryCode: "",
        contact: "",
        name: "",
        surname: "",
        type: "",
        terms: false,
        notReg: false,
    }

    const [registerObject, setRegisterObject] = useState<any>(initRegister);
    const [otp, setOtp] = useState<string>("");
    const [step, setStep] = useState<number>(1);

    const update = (key: string, value: string) => {
        const obj = { ...registerObject };
        obj[key] = value;
        setRegisterObject(obj);
        console.log(key, value);
    }

    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {

        event.preventDefault();

        // Error Checking
        if (registerObject.email !== registerObject.confirmEmail) {
            return ErrorToast({ text: "The email addresses provided do not match." });
        } else if (registerObject.password !== registerObject.confirmPassword) {
            return ErrorToast({ text: "The passwords provided to not match." });
        } else if (!registerObject.name) {
            return ErrorToast({ text: "We do not know what to call you by. Please provide us your name." });
        } else if (!registerObject.surname) {
            return ErrorToast({ text: "We do not know what to call you. Please provide us your surname." });
        }

        const data: IRegisterRequest = {
            email: registerObject.email,
            password: registerObject.password,
            firstName: registerObject.name,
            lastName: registerObject.surname
        }

        dispatch(register(data));

    }

    const otpSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const data: IOTPVerifyRequest = {
            email: registerObject.email,
            otp: otp
        }

        dispatch(otpVerify(data));
    }

    return (
        <>
            <Head>
                <title>Avalanche</title>
            </Head>
            <Toaster />
            <section className="bg-gray-50 dark:bg-primaryBackground">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <Image src={tempLogo} className="w-10 h-10 mr-2" alt="Logo" />
                        Avalanche Analytics
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-secondaryBackground dark:border-primaryBackground">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            {step === 1 &&
                                <form className="space-y-4 md:space-y-6" onSubmit={(event) => formSubmit(event)}>
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Create an Account
                                    </h1>
                                    <div className="flex flex-row mb-2 gap-2">
                                        <div className="w-full">
                                            <InputLabel htmlFor="name" text="Name" />
                                            <Input type="text" placeholder="Michael" name="name" id="name" required={true} value={registerObject.name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                                update("name", event.currentTarget.value);
                                            }} />
                                        </div>
                                        <div className="w-full">
                                            <InputLabel htmlFor="surname" text="Surname" />
                                            <Input type="text" placeholder="Scott" name="surname" id="surname" required={true} value={registerObject.surname} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                                update("surname", event.currentTarget.value);
                                            }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-row mb-2 gap-2">
                                        <div className="w-full">
                                            <InputLabel htmlFor="email" text="Your email" />
                                            <Input type="email" placeholder="michael@dundermifflin.com" name="email" id="email" required={true} value={registerObject.email} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                                update("email", event.currentTarget.value);
                                            }} />
                                        </div>
                                        <div className="w-full">
                                            <InputLabel htmlFor="confirm-email" text="Confirm your email" />
                                            <Input type="email" placeholder="michael@dundermifflin.com" name="confirm-email" id="confirm-email" required={true} value={registerObject.confirmEmail} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                                update("confirmEmail", event.currentTarget.value);
                                            }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-row mb-2 gap-2">
                                        <div className="w-full">
                                            <InputLabel htmlFor="password" text="Your password" />
                                            <Input type="password" placeholder="••••••••" name="password" id="password" required={true} value={registerObject.password} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                                update("password", event.currentTarget.value);
                                            }} />
                                        </div>
                                        <div className="w-full">
                                            <InputLabel htmlFor="confirm-password" text="Confirm your password" />
                                            <Input type="password" placeholder="••••••••" name="confirm-password" id="confirm-password" required={true} value={registerObject.confirmPassword} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                                update("confirmPassword", event.currentTarget.value);
                                            }} />
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <Checkbox required={true} describedby='terms' id='terms' />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <Anchor href="#" text="Terms and Conditions" /></label>
                                        </div>
                                    </div>
                                    <SubmitButton disabled={stateUser.requests.loading} loading={stateUser.requests.loading} text="Create an Account" onClick={() => { }} className='w-full' />
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Already have an account? <Anchor href="/" text="Login here" />
                                    </p>
                                </form>}
                            {step === 2 && <form className="space-y-4 md:space-y-6" onSubmit={(event) => otpSubmit(event)}>
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Verification
                                </h1>
                                <div className="w-full">
                                    <InputLabel htmlFor="verify-code" text="Enter the code your just recieved in your email..." />
                                    <Input type="numeric" placeholder="000000" name="verify-code" id="verify-code" required={true} value={otp} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                        setOtp(event.currentTarget.value);
                                    }} />
                                </div>
                                <SubmitButton disabled={stateUser.requests.loading} loading={stateUser.requests.loading} text="Submit OTP" onClick={() => { }} className='w-full' />
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Anchor href="/" text="Login here" />
                                </p>
                            </form>}
                            {step === 3 && <div>
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-2">
                                    Successfully Registered
                                </h1>
                                <Anchor href="/" text="Go back to login" />
                            </div>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}