import { ModalWrapper } from './ModalOptions';

export default function WHOISModal({ data }: any) {
    return (
        <ModalWrapper title="WhoIS">
            <div className="text-black dark:text-white" style={{ whiteSpace: "pre-wrap" }}>
                {data.replaceAll()}
            </div>
        </ModalWrapper>
    )
}