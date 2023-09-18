import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { HomeIcon, StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StartOutlineIcon } from "@heroicons/react/24/outline";
import Head from "next/head"
import Link from "next/link"

export default function Home() {
    return (<>
        <Head>
            <title>Home</title>
        </Head>
        <Sidebar />

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen">
            <div className="flex justify-between items-center">
                <PageHeader title="Home" subtitle="Welcome Home" icon={<HomeIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-0 pt-4 md:p-4" id="pageData">
                <div className="grid lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2 gap-5 mb-4 grid-rows-2">
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/zeus">
                        <div className="flex flex-col items-center justify-between h-full pt-10 pb-10 relative" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/undraw_team_page_re_cffb.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Zeus</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Edit them micro-services</span>
                            </div>
                            <StartOutlineIcon className="w-6 h-6 text-yellow-500 absolute top-5 right-5" />
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/hera">
                        <div className="flex flex-col items-center justify-between h-full pt-10 pb-10 relative" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/undraw_team_page_re_cffb.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Hera</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Give Es to those TOUs</span>
                            </div>
                            <StartOutlineIcon className="w-6 h-6 text-yellow-500 absolute top-5 right-5" />
                        </div>
                    </Link>
                    
                </div>
                
            </div>
        </div>
    </>)
}