import Link from "next/link";

export default function HomeCard({ title, description, image, url }: any) {
    return <Link className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-dark-background dark:border-gray-700 hover:shadow-2xl duration-75 hover:scale-105" href={url}>
        <div className="flex flex-col items-center justify-between h-full p-10" >
            <img className="w-64 mb-3" src={image} alt="Bonnie image" />
            <div className="flex flex-col items-center">
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white text-center">{title}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400 text-center">{description}</span>
            </div>
        </div>
    </Link>
}