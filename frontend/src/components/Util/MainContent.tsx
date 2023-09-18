interface IMainContent {
    children: React.ReactNode
}

export default function MainContent({ children }: IMainContent) {
    return (
        <div className="p-4 sm:ml-64 bg-gray-100 dark:bg-dark-secondaryBackground min-h-screen">
            {children}
        </div>
    )
}