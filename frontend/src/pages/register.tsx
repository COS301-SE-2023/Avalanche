import Head from 'next/head'
import { Anchor, Checkbox, Input, InputLabel, ErrorToast, SubmitButton, SuccessToast, WarningAlert, DangerAlert, SuccessAlert } from '@/components/Util'
import { useState, useEffect, } from 'react';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userState, register, resetRequest, otpVerify } from '@/store/Slices/userSlice';
import { IRegisterRequest, IOTPVerifyRequest } from '@/interfaces/requests';
import { CheckCircleIcon, HashtagIcon, IdentificationIcon, EnvelopeIcon } from "@heroicons/react/24/solid"
import lightBanner from '../assets/images/light-banner.png';
import { Transition } from '@headlessui/react';

export default function Register() {

    const dispatch = useDispatch<any>();
    const stateUser = useSelector(userState);

    /**
     * When the page renders for the first time, the state should clear so it works as intended
     */
    useEffect(() => {
        dispatch(resetRequest());
    }, [])

    /**
     * This listens to state changes
     */
    useEffect(() => {

        if (stateUser.requests.awaitingOTP && stateUser.requests.register) {
            setStep(2);
            SuccessToast({ text: `Please check the provided email address (${registerObject.email}) for an OTP.` })
        }

    }, [stateUser.requests.awaitingOTP]);

    /**
     * This listen to state changes, specifically for the userstate.requests.otp, so see if and when the otp value changes
     */
    useEffect(() => {
        if (stateUser.requests.otp) {
            if (stateUser.requests.error) {
                ErrorToast({ text: "Something went wrong" });
            } else if (stateUser.requests.message) {
                SuccessToast({ text: "You have successfully registered. You can login now." })
                setStep(3);
            }
        }
    }, [stateUser.requests.otp]);

    /**
     * This is the initial register object that will be used throughout the register page
     */
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

    enum Password {
        VALID, NOMATCH, NOREQ, EMPTY
    }


    const [registerObject, setRegisterObject] = useState<any>(initRegister);
    const [passwordsMatch, setPassowrdsMatch] = useState<Password>(Password.EMPTY);
    const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;
    const [emailsMatch, setEmailsMatch] = useState<boolean>(true);
    const [otp, setOtp] = useState<string>("");
    const [step, setStep] = useState<number>(1);

    /**
     * Update function for the register object, is key value pair
     * @param key 
     * @param value 
     */
    const update = (key: string, value: string) => {
        const obj = { ...registerObject };
        obj[key] = value;
        setRegisterObject(obj);
    }

    /**
     * Handles the event for the register form submit
     * @param event is linked to the form submit action
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {

        event.preventDefault();

        if (registerObject.email !== registerObject.confirmEmail) {
            return ErrorToast({ text: "The email addresses provided do not match." });
        } else if (registerObject.password !== registerObject.confirmPassword) {
            return ErrorToast({ text: "The passwords provided to not match." });
        } else if (!registerObject.name) {
            return ErrorToast({ text: "We do not know what to call you by. Please provide us your name." });
        } else if (!registerObject.surname) {
            return ErrorToast({ text: "We do not know what to call you. Please provide us your surname." });
        }

        dispatch(register({
            email: registerObject.email,
            password: registerObject.password,
            firstName: registerObject.name,
            lastName: registerObject.surname
        } as IRegisterRequest));

    }

    /**
     * Handles the event for the otp form submit
     * @param event is linked to the form submit action
     */
    const otpSubmit = (event: React.FormEvent<HTMLFormElement>): void => {

        event.preventDefault();

        dispatch(otpVerify({
            email: registerObject.email,
            otp: otp
        } as IOTPVerifyRequest));

    }

    useEffect(() => {
        if (registerObject.email && registerObject.confirmEmail && registerObject.confirmEmail !== registerObject.email) {
            setEmailsMatch(false);
        } else {
            setEmailsMatch(true);
        }
    }, [registerObject.email, registerObject.confirmEmail]);

    useEffect(() => {
        if (registerObject.password && !passwordRegex.test(registerObject.password)) {
            setPassowrdsMatch(Password.NOREQ);
        } else {
            if (registerObject.confirmPassword && registerObject.password !== registerObject.confirmPassword) {
                setPassowrdsMatch(Password.NOMATCH)
            } else {
                setPassowrdsMatch(Password.VALID)
            }
        }
    }, [registerObject.password, registerObject.confirmPassword])

    return (
        <>
            <Head>
                <title>Avalanche</title>
            </Head>
            <Toaster />
            <section className="bg-gray-50 dark:bg-dark-background">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Image src={lightBanner} className="w-full sm:max-w-sm mb-2" alt="Logo" />
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-dark-secondaryBackground dark:border-dark-secondaryBackground">
                        <ol className="flex justify-center items-center w-full pr-6 pl-6 pt-6">
                            <li className="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800">
                                <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                                    <IdentificationIcon className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300" />
                                </span>
                            </li>
                            {step === 2 || step === 3 ?
                                <li className="flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800">
                                    <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                                        <HashtagIcon className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300" />
                                    </span>
                                </li>
                                : <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700">
                                    <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                                        <HashtagIcon className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100" />
                                    </span>
                                </li>}
                            {step === 3 ? <li className="flex items-center">
                                <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                                    <CheckCircleIcon className="w-5 h-5 text-blue-600 lg:w-6 lg:h-6 dark:text-blue-300" />
                                </span>
                            </li> : <li className="flex items-center">
                                <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                                    <CheckCircleIcon className="w-5 h-5 text-gray-500 lg:w-6 lg:h-6 dark:text-gray-100" />
                                </span>
                            </li>}

                        </ol>

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
                                            }} error={!emailsMatch} />
                                        </div>
                                        <div className="w-full">
                                            <InputLabel htmlFor="confirm-email" text="Confirm your email" />
                                            <Input type="email" placeholder="michael@dundermifflin.com" name="confirm-email" id="confirm-email" required={true} value={registerObject.confirmEmail} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                                update("confirmEmail", event.currentTarget.value);
                                            }} error={!emailsMatch} />
                                        </div>
                                    </div>
                                    <Transition
                                        show={!emailsMatch}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <WarningAlert title="Emails do not match!" text="The two provided email addresses to not match." />
                                    </Transition>
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
                                    <Transition
                                        show={passwordsMatch === Password.NOREQ || passwordsMatch === Password.NOMATCH}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <WarningAlert title="Invalid Password!" text={passwordsMatch === Password.NOREQ ? "This password does not match the requirements. You need at least 1 capital letter, 1 number, 1 symbol and at least 8 characters long." : passwordsMatch === Password.NOMATCH ? "Your passwords don't match." : "There is an error with your passwords."} />
                                    </Transition>

                                    {/* <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <Checkbox required={true} describedby='terms' id='terms' />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <Anchor href="#" text="Terms and Conditions" /></label>
                                        </div>
                                    </div> */}
                                    <SubmitButton disabled={stateUser.requests.loading} loading={stateUser.requests.loading} text="Create your Account" onClick={() => { }} className='w-full' />
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                        Already have an account? <Anchor href="/" text="Login here" />
                                    </p>
                                </form>}
                            {step === 2 && <form className="space-y-4 md:space-y-4" onSubmit={(event) => otpSubmit(event)}>
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Verification
                                </h1>
                                <SuccessAlert title='Success' text={`An OTP was sent to ${registerObject.email}. Please allow up to 10 minutes for the OTP to arrive.`} />
                                <div className="w-full">
                                    <InputLabel htmlFor="verify-code" text="OTP Code" />
                                    <Input type="numeric" placeholder="000000" name="verify-code" id="verify-code" required={true} value={otp} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                        setOtp(event.currentTarget.value);
                                    }} />
                                </div>
                                <SubmitButton disabled={stateUser.requests.loading} loading={stateUser.requests.loading} text="Submit OTP" onClick={() => { }} className='w-full' />
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Anchor href="/" text="Login here" />
                                </p>
                            </form>}
                            {step === 3 && <div className='flex flex-col gap-4'>
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Successfully Registered
                                </h1>
                                <SuccessAlert title='Registered!' text={`You are successfully registered on Avalanche Analytics! Go back to the login page to get started.`} />
                                <Anchor href="/" text="Go back to login" />
                            </div>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}