import { IIntergrationLoginData as IData } from "@/interfaces";
import {
  Input,
  InputLabel,
  SubmitButton,
  AlternativeButton,
  ErrorToast,
  SuccessToast,
  DataProductItem as ListItem,
  DoubleToggle,
  Dropdown
} from "../Util";
import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import "animate.css";
import { ModalWrapper } from "./ModalOptions";
import ky, { HTTPError } from "ky";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { getEndpoints } from "@/store/Slices/permissionSlice";
import { getLatestOrganisation, getUserGroups } from "@/store/Slices/userSlice";

interface IIntegrationLoginModal { }

export default function IntegrationLoginModal({ }: IIntegrationLoginModal) {

  const dispatch = useDispatch<any>();

  /**
   * This state variable handles whether the dropdown for selecting the integration should be open for closed.
   */
  const [dropdown, setDropdown] = useState<boolean>(false);

  /**
   * This hold the array of integrations available
   */
  const integrations: IData[] = [
    {
      name: "ZACR",
      endpoint: "ZARC",
      image: "https://registry.net.za/favicon.ico",
    },
    {
      name: "AFRICA",
      endpoint: "Africa",
      image: "https://registry.africa/favicon.ico",
    },
    // add more items here
  ];
  /**
   * This state variable holds the integration data.
   */
  const [integration, setIntegration] = useState<IData>({
    name: "",
    image: "",
    endpoint: ""
  });

  /**
   * This state variable holds whether the integration has been selected and is valid.
   */
  const [valid, setValid] = useState<boolean>(false);

  /**
   * This state variable just holds whether there is currently something loading or not.
   */
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * This state variable holds the email from the form.
   */
  const [email, setEmail] = useState<string>("");

  /**
   * This state variable holds the password from the form.
   */
  const [password, setPassword] = useState<string>("");

  const [isPersonal, setIsPersonal] = useState<boolean>(true);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    if (!isPersonal) {
      const fetchUserGroups = async () => {
        const response = await dispatch(getUserGroups({}));
        if (response.payload) {
          setUserGroups(response.payload.users);
        }
      };
      fetchUserGroups();
    }
  }, [isPersonal]);

  /**
   * Contains the logic to handle the form onSubmit event
   * This should call Redux to call the backend to do its logic
   * @param event is the event from the forms onSubmit action
   */
  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);

    // user-management/integrateWithWExternalAPI
    if (integration.name == "ZACR" || integration.name == "AFRICA") {
      try {
        const res = await ky
          .post(
            `${process.env.NEXT_PUBLIC_API}/user-management/integrateUserWith${integration.endpoint}ExternalAPI`,
            {
              timeout: false,
              json: {
                type: integration.name,
                allocateToName: isPersonal ? email : selectedGroup,
                username: email,
                password: password,
                personal: isPersonal,
              },
              headers: {
                Authorization: `Bearer ${getCookie("jwt")}`,
              },
            }
          )
          .json();

        dispatch(getEndpoints());
        dispatch(getLatestOrganisation({}));
        SuccessToast({ text: "Successfully added integration." });
      } catch (e) {
        let error = e as HTTPError;
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          return ErrorToast({ text: errorJson.message });
        }
      }
    }
  };

  /**
   * This function renders the html to the DOM.
   */
  return (
    <ModalWrapper title="Add a new Data Product">
      {/* Modal Content */}
      <AlternativeButton
        text={valid ? integration.name : "Select Date Product"}
        onClick={() => {
          setDropdown(!dropdown);
        }}
        icon={
          dropdown ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )
        }
        className="w-full gap-2 flex justify-center"
      />

      {dropdown && (
        <div
          id="dropdown"
          className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 w-full"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {integrations.map((integrationData, index) => (
              <ListItem
                key={index}
                name={integrationData.name}
                endpoint={integrationData.endpoint}
                image={integrationData.image}
                setIntegration={setIntegration}
                setValid={setValid}
                setDropdown={setDropdown}
              />
            ))}
          </ul>
        </div>
      )}

      {valid && (
        <>
          <p className="text-grey-900 dark:text-white text-center mb-4">
            Please use your {integration.name} credentials to add this
            integration.
          </p>
          <form className="space-y-6" onSubmit={(e) => formSubmit(e)}>
            <div>
              <InputLabel htmlFor="email" text="Your email" />
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="name@company.com"
                required={true}
                disabled={loading}
                value={email}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  setEmail(event.currentTarget.value);
                }}
              />
            </div>
            <div>
              <InputLabel htmlFor="password" text="Password" />
              <Input
                type="password"
                placeholder="••••••••"
                id="password"
                name="password"
                required={true}
                disabled={loading}
                value={password}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  setPassword(event.currentTarget.value);
                }}
              />
            </div>
            <div>
              <DoubleToggle leftTitle="Personal" rightTitle="User Group" value={!isPersonal} onChange={(e: React.FormEvent<HTMLFormElement>) => setIsPersonal(!isPersonal)} name="isPersonal" />
            </div>
            {!isPersonal && (
              <Dropdown items={userGroups.map((item: any) => item.userGroupName)} id="userGroup" option={selectedGroup} set={(e: string) => {
                setSelectedGroup(e);
              }} text="Select a user group" />
            )}
            <SubmitButton
              text={`Login to ${integration.name}`}
              onClick={() => { }}
              className="w-full"
              loading={loading}
            />
          </form>
        </>
      )}
    </ModalWrapper>
  );
}
