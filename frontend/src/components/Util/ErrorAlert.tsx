interface IWarningAlert {
    title: string,
    text: any,
    className?: string,
    italic?: boolean,
    report?: string,
}

export default function ErrorAlert({ title, text, className, italic = false, report = "" }: IWarningAlert) {
    return <div className={`flex p-4 text-sm text-white border border-danger-border rounded-lg bg-danger-background/80 dark:bg-dark-background dark:text-danger-background dark:border-text-danger-border ${className}`} role="alert">
        <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
        <span className="sr-only">Warning</span>
        <div>
            <span className="font-medium">{title}</span> <span className={""}>{text}. {report && <span className="not-italic font-bold">   {report}</span>}</span>
        </div>
    </div>
}