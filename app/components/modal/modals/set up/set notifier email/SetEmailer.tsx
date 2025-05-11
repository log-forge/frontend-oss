import clsx from "clsx";
import { useEffect, useState } from "react";
import DefaultButton from "~/components/components library/button/DefaultButton";
import DefaultInput from "~/components/components library/inputs/DefaultInput";
import type { ModalProps } from "~/context/ModalContext";
import axiosClient from "~/utils/axiosClient";

export default function SetEmailer({ modalState, modalKey, closeModal }: Partial<ModalProps>) {
  const [fetchingEmail, setFetchingEmail] = useState({ isPending: true, isError: false, error: "", success: "" });
  const [email, setEmail] = useState<string>("");
  const [fetchingPassowrd, setFetchingPassword] = useState({ isPending: true, isError: false, error: "", success: "" });
  const [password, setPassword] = useState<string>("");

  const fetchEmail = async () => {
    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
      const _t0 = `${Date.now().toString()} fetchEmail`;
      console.time(_t0);
      const { status, data } = await axiosClient.get(`${baseURL}/config/email/sender`);
      console.timeEnd(_t0);
      if (status != 200 || !("sender" in data) || !data.sender)
        setFetchingEmail({ isPending: false, isError: true, error: "Failed to fetch current notifier email", success: "" });

      setEmail(data.sender);
      localStorage.setItem("LogForge-notifierEmail", data.sender);
      setFetchingEmail({ isPending: false, isError: false, error: "", success: "" });
    } catch (error) {
      console.error("Error fetching notifier email:", error);
      setFetchingEmail({ isPending: false, isError: true, error: "Failed to fetch current notifier email", success: "" });
    }
  };

  const fetchPassword = async () => {
    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
      const _t0 = `${Date.now().toString()} fetchPassword`;
      console.time(_t0);
      const { status, data } = await axiosClient.get(`${baseURL}/config/email/app_password`);
      console.timeEnd(_t0);
      if (status != 200 || !("app_password" in data) || !data.app_password)
        setFetchingPassword({ isPending: false, isError: true, error: data?.error?.message || "Failed to fetch app password", success: "" });

      setPassword(data.app_password);
      setFetchingPassword({ isPending: false, isError: false, error: "", success: "" });
    } catch (error) {
      console.error("Error fetching notifier email:", error);
      setFetchingPassword({ isPending: false, isError: true, error: "Failed to fetch app password", success: "" });
    }
  };

  useEffect(() => {
    // Fetch the current notifier email from the server or local storage
    // For example, using local storage:
    const storedEmail = localStorage.getItem("LogForge-notifierEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setFetchingEmail({ isPending: false, isError: false, error: "", success: "" });
    }

    fetchEmail();
    fetchPassword();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
    }
  };

  const handleSettingNewEmail = async () => {
    const currentEmail = localStorage.getItem("LogForge-notifierEmail");
    if (currentEmail === email) {
      setFetchingEmail({ isPending: false, isError: true, error: "Email is already set to this", success: "" });
      return;
    }
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setFetchingEmail({ isPending: false, isError: true, error: "Email must be a Gmail address", success: "" });
      return;
    }

    // proceed with request
    setFetchingEmail({ isPending: true, isError: false, error: "", success: "" });
    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
      const _t0 = `${Date.now().toString()} handleSettingNewEmail`;
      console.time(_t0);
      const { status } = await axiosClient.post(`${baseURL}/config/email/sender`, { email: email });
      console.timeEnd(_t0);
      if (status != 200) setFetchingEmail({ isPending: false, isError: true, error: "Failed to set notifier email", success: "" });

      localStorage.setItem("LogForge-notifierEmail", email);
      setFetchingEmail({ isPending: false, isError: false, error: "", success: `Notifier email set successfully to ${email}` });
    } catch (error) {
      console.error("Error setting notifier email:", error);
      setFetchingEmail({ isPending: false, isError: true, error: "Failed to set notifier email", success: "" });
    }
  };

  const handleSettingNewAppPassword = async () => {
    // proceed with request
    setFetchingPassword({ isPending: true, isError: false, error: "", success: "" });
    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
      const _t0 = `${Date.now().toString()} handleSettingNewAppPassword`;
      console.time(_t0);
      const { status } = await axiosClient.post(`${baseURL}/config/email/app_password`, { password: password });
      console.timeEnd(_t0);
      if (status != 200) setFetchingPassword({ isPending: false, isError: true, error: "Failed to set app password", success: "" });

      setFetchingPassword({ isPending: false, isError: false, error: "", success: `App password set successfully` });
    } catch (error) {
      console.error("Error setting app password:", error);
      setFetchingPassword({ isPending: false, isError: true, error: "Failed to set app password", success: "" });
    }
  };

  return (
    <div className="relative flex h-[auto] w-full flex-col justify-start bg-transparent text-text">
      <h4 className="mb-xs block text-h4 font-medium">Set Notifier Email</h4>
      {/* Error */}
      {fetchingEmail.isError && (
        <div className="mb-2xs w-full rounded-(--spacing-3xs) border border-error bg-error/20 p-2xs text-t text-error-300 light:text-error">
          {fetchingEmail.error || "Failed to fetch email from server"}
        </div>
      )}
      {fetchingPassowrd.isError && (
        <div className="mb-2xs w-full rounded-(--spacing-3xs) border border-error bg-error/20 p-2xs text-t text-error-300 light:text-error">
          {fetchingPassowrd.error || "Failed to fetch app password from server"}
        </div>
      )}
      <p className="text-s text-alt-text">Set the gmail that you would like to use to send alert or notification emails.</p>
      <p className="mt-2xs text-t text-warning">* This must be a gmail.</p>
      {/* Email */}
      <div className={clsx("flex w-full flex-row items-center justify-start gap-3xs", fetchingEmail.success ? "" : "mb-2xs")}>
        <DefaultInput
          {...{
            type: "text",
            value: email,
            onChange: handleChange,
            disabled: fetchingEmail.isPending,
            loading: fetchingEmail.isPending,
            attributes: {
              name: "email",
              placeholder: "example@gmail.com",
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleSettingNewEmail();
                }
              },
            },
            stretch: "full",
            color: "secondary",
            radius: "3xs",
            slim: true,
            textSize: "s",
          }}
        />
        <DefaultButton
          {...{
            onClick: handleSettingNewEmail,
            disabled: fetchingEmail.isPending || !email,
            loading: fetchingEmail.isPending,
            slim: true,
            radius: "3xs",
            customTailwind: "text-s",
          }}
        >
          set
        </DefaultButton>
      </div>
      {/* Email Success */}
      {fetchingEmail.success && (
        <div className="mb-2xs w-full text-t text-success light:text-success">{fetchingEmail.success || "Notifier email set successfully"}</div>
      )}
      {/* Password */}
      <div className={clsx("flex w-full flex-row items-center justify-start gap-3xs", fetchingPassowrd.success ? "" : "mb-2xs")}>
        <DefaultInput
          {...{
            type: "password",
            value: password,
            onChange: handleChange,
            disabled: fetchingPassowrd.isPending,
            loading: fetchingPassowrd.isPending,
            attributes: {
              name: "password",
              placeholder: "password",
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleSettingNewAppPassword();
                }
              },
            },
            stretch: "full",
            color: "secondary",
            radius: "3xs",
            slim: true,
            textSize: "s",
          }}
        />
        <DefaultButton
          {...{
            onClick: handleSettingNewAppPassword,
            disabled: fetchingPassowrd.isPending || !password,
            loading: fetchingPassowrd.isPending,
            slim: true,
            radius: "3xs",
            customTailwind: "text-s",
          }}
        >
          set
        </DefaultButton>
      </div>
      {/* Password Success */}
      {fetchingPassowrd.success && (
        <div className="mb-2xs w-full text-t text-success light:text-success">{fetchingPassowrd.success || "App password set successfully"}</div>
      )}
    </div>
  );
}
