import { HomeIcon, DocumentIcon, HeartIcon, ArchiveBoxIcon, DocumentMagnifyingGlassIcon, TvIcon, ChartBarIcon, StarIcon, EyeIcon, MapIcon, BoltIcon, ClipboardIcon, ChartBarSquareIcon, Squares2X2Icon } from '@heroicons/react/24/solid';

interface IMenuItem {
    text: string,
    icon: any,
    page: string,
    role?: string,
    endpoint?: string,
}

interface IMenu {
    items: IMenuItem[],
}

const holder = "w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white";

const NotDropdown: IMenu = {
    items: [
        {
            text: "Domain Watch",
            icon: <DocumentMagnifyingGlassIcon className={holder} />,
            page: "watch",
            role: ""
        },
        {
            text: "QBee",
            icon: <Squares2X2Icon className={holder} />,
            page: "qbee",
            role: ""
        },
    ]
}

const MenuOptions: IMenu = {
    items: [
        {
            text: "Transactions",
            icon: <ChartBarSquareIcon className={holder} />,
            page: "dashboard",
            role: "",
            endpoint: "transactions"
        },
        {
            text: "Registrar",
            icon: <TvIcon className={holder} />,
            page: "registrar",
            role: "",
            endpoint: "transactions"
        },
        {
            text: "Registrar Market Comparison",
            icon: <MapIcon className={holder} />,
            page: "registrarMarketComparison",
            role: "",
            endpoint: "transaction-ranking"
        },
        {
            text: "Movement",
            icon: <BoltIcon className={holder} />,
            page: "movement",
            role: "",
            endpoint: "movement/vertical"
        },
        {
            text: "Domain Length",
            icon: <ClipboardIcon className={holder} />,
            page: "domainLength",
            role: "",
            endpoint: "domainNameAnalysis/length"
        },
        {
            text: "Market Share",
            icon: <ChartBarIcon className={holder} />,
            page: "marketShare",
            role: "",
            endpoint: "marketShare"
        },
        {
            text: "Registrar Age Analysis",
            icon: <HeartIcon className={holder} />,
            page: "ageAnalysis",
            role: "",
            endpoint: "age"
        },
        {
            text: "Domain Name Analysis",
            icon: <EyeIcon className={holder} />,
            page: "domainNameAnalysis",
            role: "",
            endpoint: "domainNameAnalysis/count"
        }
    ]
}

interface IDataSourceItem {
    code: string,
    value: string
}

const dataSourceDescriptors: IDataSourceItem[] = [
    {
        code: "zacr",
        value: "Everything in the .ZA namespace"
    },
    {
        code: "africa",
        value: "Everything in the .AFRICA namespace"
    },
    {
        code: "ryce",
        value: "Everything in the EUROPEAN namespace"
    }
]

const dataSourceName: IDataSourceItem[] = [
    {
        code: "zacr",
        value: "ZACR"
    },
    {
        code: "africa",
        value: "Africa"
    },
    {
        code: "ryce",
        value: "RyCE"
    }
]

export { MenuOptions, NotDropdown, dataSourceDescriptors, dataSourceName };
export type { IDataSourceItem };
