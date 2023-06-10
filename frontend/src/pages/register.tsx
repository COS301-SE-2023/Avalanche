import Head from 'next/head'
import { Anchor, Checkbox, Input, InputLabel, WarningAlert } from '@/components/Util'
import { useState } from 'react';
import tempLogo from '../assets/logo.png';
import Image from 'next/image';

interface IRegister {
    email: string,
    password: string,
    contactNumber: string,
    name: string,
    surname: string,
    type: string,
    countryCode: string
}

const stepper = {
    active: "flex md:w-full items-center text-blue-600 dark:text-blue-500",
    inactive: "flex items-center"
}

const stepperContent = {
    active: "flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500",
    inactive: "mr-2"
}

export default function Register() {

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

    return (
        <>
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
                            {step === 1 && <form className="space-y-4 md:space-y-6" action="#">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Create an Account
                                </h1>
                                <div className="flex flex-row mb-2 gap-2">
                                    <div className="w-full">
                                        <InputLabel htmlFor="name" text="Name" />
                                        <Input type="text" placeholder="Michael" name="name" id="name" required={true} value={registerObject.name} />
                                    </div>
                                    <div className="w-full">
                                        <InputLabel htmlFor="surname" text="Surname" />
                                        <Input type="text" placeholder="Scott" name="surname" id="surname" required={true} value={registerObject.surname} />
                                    </div>
                                </div>
                                <div className="flex flex-row mb-2 gap-2">
                                    <div className="w-full">
                                        <InputLabel htmlFor="email" text="Your email" />
                                        <Input type="email" placeholder="michael@dundermifflin.com" name="email" id="email" required={true} value={registerObject.email} />
                                    </div>
                                    <div className="w-full">
                                        <InputLabel htmlFor="confirm-email" text="Confirm your email" />
                                        <Input type="email" placeholder="michael@dundermifflin.com" name="confirm-email" id="confirm-email" required={true} value={registerObject.confirmEmail} />
                                    </div>
                                </div>
                                <div className="flex flex-row mb-2 gap-2">
                                    <div className="w-full">
                                        <InputLabel htmlFor="password" text="Your password" />
                                        <Input type="password" placeholder="••••••••" name="password" id="password" required={true} value={registerObject.password} />
                                    </div>
                                    <div className="w-full">
                                        <InputLabel htmlFor="confirm-password" text="Confirm your password" />
                                        <Input type="password" placeholder="••••••••" name="confirm-password" id="confirm-password" required={true} value={registerObject.confirmPassword} />
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
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Anchor href="/" text="Login here" />
                                </p>
                            </form>}
                            {step === 2 && <form className="space-y-4 md:space-y-6" action="#">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Verification
                                </h1>
                                <div className="w-full">
                                    <InputLabel htmlFor="verify-code" text="Enter the code your just recieved in your email..." />
                                    <Input type="numeric" placeholder="000000" name="verify-code" id="verify-code" required={true} value={otp} />
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Verify</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Anchor href="/" text="Login here" />
                                </p>
                            </form>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}