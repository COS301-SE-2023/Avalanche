interface IModalContent {
    children: any
}

export default function ModalContent({ children }: IModalContent) {
    return <div className="mb-4">{children}</div>
}