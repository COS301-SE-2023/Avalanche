import Sidebar from "@/components/Navigation/SideBar"
import PageHeader from "@/components/Util/PageHeader"
import { HomeIcon } from "@heroicons/react/24/solid"
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
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/custom/create">
                        <div className="flex flex-col items-center justify-between h-full pt-10 pb-10" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/custom-dashboards.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Create a Custom Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Create custom dashboards, with data tailored to your liking</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75 " href="/domainLength">
                        <div className="flex flex-col items-center justify-between h-full pt-10 pb-10" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/undraw_financial_data_re_p0fl.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">View Domain Length</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">View the average length of all your domains under your roof</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/settings?tab=organizations">
                        <div className="flex flex-col items-center justify-between h-full pt-10 pb-10" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/undraw_team_page_re_cffb.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">View your Organisation</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">View your organisation, groups and users</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/marketShare">
                        <div className="flex flex-col items-center justify-between h-full pt-10 pb-10" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/undraw_pie_chart_re_bgs8.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Marketshare</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">See who you are competing against</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </>)
}