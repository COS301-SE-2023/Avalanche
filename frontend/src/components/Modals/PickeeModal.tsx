import { ModalWrapper } from './ModalOptions';

export default function PickeeModal({ data }: any) {
    const imageSrc = `data:image/png;base64,${data}`;

    return (
        <ModalWrapper title="Screenshot of Domain">
            <div className="text-black dark:text-white" style={{ whiteSpace: "pre-wrap" }}>
                <img src={imageSrc} alt="Base64 Encoded" />
            </div>
        </ModalWrapper>
    );
}
