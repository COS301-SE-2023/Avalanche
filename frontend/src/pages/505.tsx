import Head from "next/head"
import Link from "next/link"

export default function Custom505() {
    return <>
        <Head>
            <title>Something went wrong...</title>
        </Head>
        <section className="bg-gray-50 dark:bg-primaryBackground">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 md:h-screen flex justify-center items-center">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-avalancheBlue dark:text-avalancheBlue">505</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something went wrong on our side...</p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Try refresh the page. If that doesn&apos;t work, I dunno ¯\_(ツ)_/¯ </p>
                    <Link href="/home" className="inline-flex text-white bg-avalancheBlue hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back to Homepage</Link>
                </div>
            </div>
        </section>
    </>
}