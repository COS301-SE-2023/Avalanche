import { ModalWrapper } from './ModalOptions';

export default function PickeeModal({ data }: any) {
    const imageSrc = `data:image/png;base64,${data}`;

    return (
        <ModalWrapper title="PickeeModal">
            <div className="text-black dark:text-white" style={{ whiteSpace: "pre-wrap" }}>
                <img src={imageSrc} alt="Base64 Encoded" />
            </div>
        </ModalWrapper>
    );
}
