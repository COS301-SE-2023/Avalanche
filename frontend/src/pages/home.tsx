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

        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-secondaryBackground min-h-screen z-0">
            <div className="flex justify-between items-center">
                <PageHeader title="Home" subtitle="Welcome Home" icon={<HomeIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-0 pt-4 md:p-4" id="pageData">
                <div className="grid lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2 gap-5 mb-4 grid-rows-2">
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/settings?tab=organizations">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/undraw_team_page_re_cffb.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">View your Organisation</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">View your organisation, groups and users</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/watch">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://user-images.githubusercontent.com/91600439/259411791-b0718ccb-a1b2-4fe2-a4cd-725508c7b4c5.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Domain Watch</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Uncover domain names similar to yours to protect your brand</span>
                            </div>
                        </div>

                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/custom/create">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://user-images.githubusercontent.com/91600439/259410440-0aece243-b560-4c4c-a8c2-d798dc7e7075.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Create a Custom Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Create custom dashboards, with data tailored to your liking</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75 " href="/dashboard">
                        <div className="flex flex-col items-center justify-between h-full p-10 " >
                            <img className="w-64 mb-3" src="https://user-images.githubusercontent.com/91600439/259405716-77c5ce66-7772-44ba-b85b-99505bba53a9.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Transaction Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Gain insights into your transactional data</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/registrar">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://user-images.githubusercontent.com/91600439/259408746-00e4adf5-826a-4144-91f6-cce9ea72f5f4.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Registrar Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">View transaction data specific per registrar</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75 " href="/registrarMarketComparison">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://user-images.githubusercontent.com/91600439/259420909-3e242a5d-69aa-4913-af7e-1e539a51abc5.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Registrar Comparison Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Compare top registrars based on their recent performance</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75 " href="/movement">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://user-images.githubusercontent.com/91600439/259409423-75868a83-9ce9-4298-bcea-dcf032f84b1d.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Domain Movement Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">View the vertical movement of domains in your space</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75 " href="/domainLength">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/undraw_financial_data_re_p0fl.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Domain Length Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">View the average length of all your domains under your roof</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/marketShare">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/undraw_pie_chart_re_bgs8.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Marketshare Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">See who you are competing against</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/ageAnalysis">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://astonmartin.sloththe.dev/isawesome/custom-dashboards.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Age Dashboard</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">See the average age of domains</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl duration-75" href="/domainNameAnalysis">
                        <div className="flex flex-col items-center justify-between h-full p-10" >
                            <img className="w-64 mb-3" src="https://user-images.githubusercontent.com/91600439/259420794-18411706-c69d-4881-91b2-3924a3e66159.svg" alt="Bonnie image" />
                            <div className="flex flex-col items-center">
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">Domain Name Analysis</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">Identifying trending keywords or themes</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </>)
}