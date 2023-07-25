import { useState, useEffect } from 'react';
import { SubmitButton, ErrorToast, InputLabel, Input, SuccessToast, Dropdown } from '../Util';
import { ModalContent, ModalHeader, ModalWrapper } from './ModalOptions';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentOpenState, setAnimateManagerState } from '@/store/Slices/modalManagerSlice';
import { userState, getUserGroups } from '@/store/Slices/userSlice';
import { createOrganisationGroup } from '@/store/Slices/userSlice';
import { ICreateUserGroupRequest } from '@/interfaces/requests';

interface ICreateGroupModal {
    state: any,
    add: any
}

export default function GraphCreateModal({ state, add }: ICreateGroupModal) {

    const dispatch = useDispatch<any>();
    const stateUser = useSelector(userState);

    useEffect(() => {

    }, [])

    // These two variables are the fields from the form. 
    const [name, setName] = useState<string>("");

    // These two variables are for error checking.
    const [nameError, setNameError] = useState<boolean>(false);

    // The current selected endpoint
    const [endpoint, setEndpoint] = useState<string>("");

    // Graph Type
    const [graph, setGraph] = useState<string>("");

    /**
     * This function handles the form submit.
     * @param event is the event triggered by the form
     */
    const formSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        let errors = [];

        if (!name) errors.push("Missing graph name.");
        if (!endpoint) errors.push("Missing endpoint.");
        if (!graph) errors.push("Missing graph type");

        if (errors.length > 0) {
            return ErrorToast({ text: errors.join("\n") })
        }

        const obj = {
            name: name,
            warehouse: endpoint,
            type: graph,
            filters: {

            }
        }

        add(obj);

        dispatch(clearCurrentOpenState());
        dispatch(setAnimateManagerState(true));

    }

    const filterGraphs = () => {
        if (endpoint) {
            const ep = state.filters.find((item: any) => item.endpoint === endpoint);
            if (!ep) return [];
            return ep.graphs.map((item: any) => item.name);
        }

        return [];
    }

    /**
     * This function renders the component to the DOM
     */
    return (
        <ModalWrapper>
            <ModalHeader title="Add a Graph" text="Time to make a new graph." />
            <ModalContent>
                <form className="space-y-6" onSubmit={(event) => formSubmit(event)}>
                    <div>
                        <InputLabel htmlFor="name" text="Graph Name" />
                        <Input type="text" name="name" id="name" placeholder="Domain sales over time" required={true} disabled={state.loading} value={name} onChange={(event: React.FormEvent<HTMLInputElement>) => {
                            nameError && setNameError(false);
                            setName(event.currentTarget.value);
                        }} maxLength={20} error={nameError} />
                    </div>

                    <div>
                        <InputLabel htmlFor='endpointDropdown' text='Warehouses' />
                        <Dropdown id='endpointDropdown' items={state.filters.map((item: any) => item.endpoint)} option={endpoint} set={setEndpoint} text="Select a warehouse" />
                    </div>

                    {endpoint && <div>
                        <InputLabel htmlFor='graphType' text='Graph Type' />
                        <Dropdown id='graphType' items={filterGraphs()} option={graph} set={setGraph} text="Select a graph type" />
                    </div>}

                    <SubmitButton text="Create Graph" onClick={(event: React.FormEvent<HTMLFormElement>) => {
                        formSubmit(event);
                    }} className="w-full" loading={state.loading} />
                </form>
            </ModalContent>
        </ModalWrapper>
    )
}