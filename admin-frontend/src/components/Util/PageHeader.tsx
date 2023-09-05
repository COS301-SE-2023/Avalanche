interface IPageHeader {
    title: string,
    subtitle: string,
    icon: any
}

export default function PageHeader({ title, subtitle, icon }: IPageHeader) {
    return <div className="flex flex-row gap-2 items-center">
        {icon}
        <div>
            <h1 className="text-3xl text-gray-900 dark:text-white font-bold">{title}</h1>
            <p className="text-lg text-gray-400">{subtitle}</p>
        </div>
    </div>
}