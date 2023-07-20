import { HomeIcon, DocumentIcon, HeartIcon, ArchiveBoxIcon, DocumentMagnifyingGlassIcon, TvIcon, ChartBarIcon, StarIcon, EyeIcon, MapIcon, BoltIcon, ClipboardIcon, CubeIcon } from '@heroicons/react/24/solid';

interface IMenuItem {
    text: string,
    icon: any,
    page: string,
    role?: string,
}

interface IMenu {
    items: IMenuItem[],
}

const holder = "w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white";

const MenuOptions: IMenu = {
    items: [
        {
            text: "Home",
            icon: <HomeIcon className={holder} />,
            page: "dashboard",
            role: ""
        },
        {
            text: "Registrar",
            icon: <TvIcon className={holder} />,
            page: "registrar",
            role: ""
        },
        {
            text: "Registrar Market Comparison",
            icon: <MapIcon className={holder} />,
            page: "registrarMarketComparison",
            role: ""
        },
        // {
        //     text: "Movement",
        //     icon: <BoltIcon className={holder} />,
        //     page: "movement",
        //     role: ""
        // },
        // {
        //     text: "Domain Length",
        //     icon: <ClipboardIcon className={holder} />,
        //     page: "domainLength",
        //     role: ""
        // },
        {
            text: "Market Share",
            icon: <ChartBarIcon className={holder} />,
            page: "marketShare",
            role: ""
        },
        {
            text: "Registrar Age Analysis",
            icon: <HeartIcon className={holder} />,
            page: "ageAnalysis",
            role: ""
        },
        {
            text: "Domain Name Analysis",
            icon: <EyeIcon className={holder} />,
            page: "domainNameAnalysis",
            role: ""
        },
        {
            text: "Reports",
            icon: <ArchiveBoxIcon className={holder} />,
            page: "reports",
            role: "",
        },
        {
            text: "Q-Bee",
            icon: <CubeIcon className={holder} />,
            page: "queryBuilder",
            role: ""
        },
        {
            text: "Domain Watch",
            icon: <DocumentMagnifyingGlassIcon className={holder} />,
            page: "watch",
            role: ""
        },
    ]
}

export default MenuOptions;