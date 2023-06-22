import { selectModalManagerState } from '@/store/Slices/modalManagerSlice';
import { useSelector } from 'react-redux';
import "animate.css";

interface IModalAnimationWrapper {
    children: any
}

export default function ModalAnimationWrapper({ children }: IModalAnimationWrapper) {

    const modalManager = useSelector(selectModalManagerState);

    return <div className={`z-50 animate__animated ${!modalManager.animateManager ? "animate__fadeIn" : "animate__fadeOut"}`}>
        {children}
    </div>
}