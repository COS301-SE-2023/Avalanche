interface ISidebarItem {
    text: string,
    icon: any,
    page: string,
    role?: string,
}

export default function SideBarItem({ text, icon, page }: ISidebarItem) {
    return <li>
        <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            {icon}
            <span className="ml-3">{text}</span>
        </a>
    </li>
}