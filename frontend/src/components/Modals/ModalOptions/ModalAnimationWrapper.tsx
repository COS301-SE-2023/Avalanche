import { selectModalManagerState } from '@/store/modalManagerSlice';
import { useSelector } from 'react-redux';

interface IModalAnimationWrapper {
    children: any
}

export default function ModalAnimationWrapper({ children }: IModalAnimationWrapper) {

    const modalManager = useSelector(selectModalManagerState);

    return <div className={`animate__animated ${!modalManager.animateManager ? "animate__fadeIn" : "animate__fadeOut"}`}>
        {children}
    </div>
}