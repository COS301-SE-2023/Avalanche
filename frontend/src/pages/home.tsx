import Sidebar from "@/components/Navigation/SideBar"
import { HomeCard, MainContent } from "@/components/Util";
import PageHeader from "@/components/Util/PageHeader"
import { HomeIcon } from "@heroicons/react/24/solid";
import Head from "next/head"
import Link from "next/link"

interface Card {
    url: string,
    title: string,
    description: string,
    image: string,
    endpoint: string
}

const links: Card[] = [
    {
        title: "View your Organisation",
        description: "View your organisation, groups and users",
        url: "/settings?tab=organizations",
        image: "https://astonmartin.sloththe.dev/isawesome/undraw_team_page_re_cffb.svg",
        endpoint: "all"
    },
    {
        title: "Domain Watch",
        description: "Uncover domain names similar to yours to protect your brand",
        url: "/watch",
        image: "https://user-images.githubusercontent.com/91600439/259411791-b0718ccb-a1b2-4fe2-a4cd-725508c7b4c5.svg",
        endpoint: "all"
    },
    {
        title: "Create a Custom Dashboard",
        description: "Create custom dashboards, with data tailored to your liking",
        url: "/custom/create",
        image: "https://user-images.githubusercontent.com/91600439/259410440-0aece243-b560-4c4c-a8c2-d798dc7e7075.svg",
        endpoint: "all"
    },
    {
        title: "Transaction Dashboard",
        description: "Gain insights into your transactional data",
        url: "/dashboard",
        image: "https://user-images.githubusercontent.com/91600439/259405716-77c5ce66-7772-44ba-b85b-99505bba53a9.svg",
        endpoint: "transactions"
    },
    {
        title: "Registrar Dashboard",
        description: "View transaction data specific per registrar",
        url: "/registrar",
        image: "https://user-images.githubusercontent.com/91600439/259408746-00e4adf5-826a-4144-91f6-cce9ea72f5f4.svg",
        endpoint: "transactions"
    },
    {
        title: "Registrar Comparison Dashboard",
        description: "Compare top registrars based on their recent performance",
        url: "/registrarMarketComparison",
        image: "https://user-images.githubusercontent.com/91600439/259420909-3e242a5d-69aa-4913-af7e-1e539a51abc5.svg",
        endpoint: "transactions-ranking"
    },
    {
        title: "Domain Movement Dashboard",
        description: "View the vertical movement of domains in your space",
        url: "/movement",
        image: "https://user-images.githubusercontent.com/91600439/259409423-75868a83-9ce9-4298-bcea-dcf032f84b1d.svg",
        endpoint: "movement/vertical"
    },
    {
        title: "Domain Length Dashboard",
        description: "View the average length of all your domains under your roof",
        url: "/domainLength",
        image: "https://astonmartin.sloththe.dev/isawesome/undraw_financial_data_re_p0fl.svg",
        endpoint: "domainNameAnalysis/length"
    },
    {
        title: "Marketshare Dashboard",
        description: "See who you are competing against",
        url: "/marketShare",
        image: "https://astonmartin.sloththe.dev/isawesome/undraw_pie_chart_re_bgs8.svg",
        endpoint: "marketShare"
    },
    {
        title: "Age Dashboard",
        description: "See the average age of domains",
        url: "/ageAnalysis",
        image: "https://astonmartin.sloththe.dev/isawesome/custom-dashboards.svg",
        endpoint: "age"
    },
    {
        title: "Domain Name Analysis",
        description: "Identifying trending keywords or themes",
        url: "/domainNameAnalysis",
        image: "https://user-images.githubusercontent.com/91600439/259420794-18411706-c69d-4881-91b2-3924a3e66159.svg",
        endpoint: "domainNameAnalysis/count"
    }
];

import { permissionState, getEndpoints, IPermission } from "@/store/Slices/permissionSlice";
import { graphState, selectDataSource } from "@/store/Slices/graphSlice";
import { useSelector } from "react-redux";

export default function Home() {


    const statePermissions = useSelector(permissionState);
    const stateGraph = useSelector(graphState);

    return (<>
        <Head>
            <title>Avalanche Home</title>
        </Head>
        <Sidebar />

        <MainContent>
            <div className="flex justify-between items-center">
                <PageHeader title="Home" subtitle="Welcome Home" icon={<HomeIcon className="h-16 w-16 text-black dark:text-white" />} />
            </div>
            <div className="p-0 pt-4 md:p-4" id="pageData">
                <div className="grid lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2 gap-5 mb-4 grid-rows-2">
                    {
                        links.map((item: any, index: number) => {
                            const statePermissionsArr = statePermissions.permissions.find((element: any) => { return element.dataSource == stateGraph.selectedDataSource });
                            if ((statePermissionsArr && statePermissionsArr.endpoints.includes(item.endpoint)) || item.endpoint === "all") {
                                return <HomeCard title={item.title} description={item.description} url={item.url} image={item.image} key={index} />
                            }
                        })
                    }
                </div>
            </div>
        </MainContent>
    </>)
}