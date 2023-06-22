interface IModalContent {
    children: any,
    addClass?: string
}

export default function ModalContent({ children, addClass }: IModalContent) {
    return <div className={`mb-4 ${addClass}`}>{children}</div>
}