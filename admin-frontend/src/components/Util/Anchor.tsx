interface IAnchor {
    href: string,
    text: string,
    target?: string,
    customClass?: string,
    customFont?: string,
}

export default function Anchor({ href, text, target = "_self", customFont }: IAnchor) {
    return <a className={`${customFont ? customFont : "font-medium"} text-primary-600 hover:underline dark:text-primary-500`} target={target} href={href}>{text}</a>
}