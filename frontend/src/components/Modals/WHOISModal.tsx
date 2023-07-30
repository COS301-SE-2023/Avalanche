import { useState, useEffect } from 'react';
import { SubmitButton, ErrorToast, InputLabel, Input, SuccessToast } from '../Util';
import { ModalWrapper } from './ModalOptions';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentOpenState } from '@/store/Slices/modalManagerSlice';
import { userState, getUserGroups, clearError } from '@/store/Slices/userSlice';
import { createOrganisationGroup, addUserToGroup } from '@/store/Slices/userSlice';
import { ICreateUserGroupRequest } from '@/interfaces/requests';

export default function WHOISModal({ data }: any) {
    /**
     * This function renders the component to the DOM
     */
    return (
        <ModalWrapper title="WhoIS">
            <div style={{ whiteSpace: "pre-wrap" }}>
                {data}
            </div>
        </ModalWrapper>
    )
}