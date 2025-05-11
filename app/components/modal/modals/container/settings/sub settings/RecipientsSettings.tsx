import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { useParams } from "react-router";
import DefaultButton from "~/components/components library/button/DefaultButton";
import DefaultInput from "~/components/components library/inputs/DefaultInput";
import axiosClient from "~/utils/axiosClient";

export default function RecipientsSettings() {
  const { id } = useParams<{ id: string }>();

  const [emailRecipeantsFetcher, setEmailRecipeantsFetcher] = useState({ isPending: true, isError: false, error: "", success: "" });
  const [emailRecipeantsMutator, setEmailRecipeantsMutator] = useState({ isPending: false, isError: false, error: "", success: "" });
  const [emailRecipeants, setEmailRecipeants] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState<string>("");

  const fetchEmailRecipients = async () => {
    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
      const { status, data } = await axiosClient.get(`${baseURL}/config/email/recipients`);
      if (status != 200) setEmailRecipeantsFetcher({ isPending: false, isError: true, error: "Failed to fetch alert recipients", success: "" });

      // API shape: Record<string, { recipients: string[] }>
      const recipientsData = data as Record<string, { recipients: string[] }>;
      let fetchedRecipients: string[] = [];

      console.log("Fetched recipients data:", recipientsData);
      console.log("Fetched recipients data id:", id);
      // only pull the list under the current `id`
      if (id && recipientsData[id]?.recipients && Array.isArray(recipientsData[id].recipients)) {
        fetchedRecipients = recipientsData[id].recipients;
      }

      console.log("Fetched recipients:", fetchedRecipients);
      // merge into state without duplicates
      setEmailRecipeants((prev) => Array.from(new Set([...prev, ...fetchedRecipients])));
      setEmailRecipeantsFetcher({ isPending: false, isError: false, error: "", success: "" });
    } catch (error) {
      console.error("Error fetching notifier email:", error);
      setEmailRecipeantsFetcher({ isPending: false, isError: true, error: "Failed to fetch alert recipients", success: "" });
    }
  };

  useEffect(() => {
    fetchEmailRecipients();
  }, []);

  const handleAddRecipient = async () => {
    if (!newRecipient) return;
    setEmailRecipeantsMutator({ isPending: true, isError: false, error: "", success: "" });

    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
      const { status, data } = await axiosClient.post(`${baseURL}/config/email/recipients/add`, { email: newRecipient, container: id });
      if (status != 200) throw new Error("Failed to set alert recipients");

      setEmailRecipeants((prev) => Array.from(new Set([...prev, newRecipient])));
      setNewRecipient("");
      setEmailRecipeantsMutator({ isPending: false, isError: false, error: "", success: "Recipient added successfully" });
    } catch (error) {
      console.error("Error setting notifier email:", error);
      setEmailRecipeantsMutator({ isPending: false, isError: true, error: "Failed to set alert recipients", success: "" });
    }
  };

  const handleRemoveRecipient = async (recipient: string) => {
    setEmailRecipeantsMutator({ isPending: true, isError: false, error: "", success: "" });
    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:${window.ENV.VITE_EXPOSED_BACKEND_PORT}`;
      const { status, data } = await axiosClient.post(`${baseURL}/config/email/recipients/remove`, { email: recipient, container: id });
      if (status != 200) throw new Error("Failed to remove alert recipients");

      setEmailRecipeants((prev) => prev.filter((item) => item !== recipient));
      setEmailRecipeantsMutator({ isPending: false, isError: false, error: "", success: "Recipient removed successfully" });
    } catch (error) {
      console.error("Error removing notifier email:", error);
      setEmailRecipeantsMutator({ isPending: false, isError: true, error: "Failed to remove alert recipients", success: "" });
    }
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-xs text-text">
      <span className="text-h4 font-medium">Container Recipients</span>
      {emailRecipeantsFetcher.isError && (
        <div className="w-full rounded-(--spacing-3xs) border border-error bg-error/20 p-2xs text-t text-error-300 light:text-error">
          {emailRecipeantsFetcher.error || "Failed to fetch email recipients from server"}
        </div>
      )}
      {emailRecipeantsFetcher.isPending ? (
        <div className="h-3xl w-full animate-pulse rounded-(--spacing-xs) bg-foreground" />
      ) : (
        <div className="flex w-full flex-col items-start justify-start gap-xs">
          {/* New Recipient Input */}
          <div className={clsx("flex w-full flex-row items-center justify-start gap-3xs")}>
            <DefaultInput
              {...{
                type: "text",
                value: newRecipient,
                onChange: (e) => {
                  setNewRecipient(e.currentTarget.value);
                },
                disabled: emailRecipeantsFetcher.isPending || emailRecipeantsFetcher.isError,
                loading: emailRecipeantsFetcher.isPending,
                attributes: {
                  name: "newRecipient",
                  placeholder: "example@gmail.com",
                  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      handleAddRecipient();
                    }
                  },
                },
                stretch: "full",
                radius: "3xs",
                slim: true,
                textSize: "s",
              }}
            />
            <DefaultButton
              {...{
                onClick: handleAddRecipient,
                disabled:
                  emailRecipeantsFetcher.isPending ||
                  emailRecipeantsFetcher.isError ||
                  !newRecipient ||
                  emailRecipeantsMutator.isPending ||
                  emailRecipeantsMutator.isError,
                loading: emailRecipeantsFetcher.isPending || emailRecipeantsMutator.isPending,
                slim: true,
                radius: "3xs",
                customTailwind: "text-s",
              }}
            >
              add
            </DefaultButton>
          </div>
          {/* Recipients */}
          <div className="flex w-full flex-col items-start justify-start gap-2xs p-3xs">
            {emailRecipeantsMutator.success && (
              <div className="w-full text-t text-success light:text-success">{emailRecipeantsMutator.success || "Recipient added successfully"}</div>
            )}
            {emailRecipeants.length > 0 ? (
              emailRecipeants.map((recipient, index) => {
                return (
                  <div
                    key={`recipient-${index}`}
                    className="flex w-full flex-row items-center justify-start gap-3xs rounded-(--spacing-3xs) bg-foreground px-xs py-3xs text-text"
                  >
                    <span className="text-s">{recipient}</span>
                    <DefaultButton
                      {...{
                        onClick: () => {
                          handleRemoveRecipient(recipient);
                        },
                        disabled:
                          emailRecipeantsFetcher.isPending ||
                          emailRecipeantsFetcher.isError ||
                          emailRecipeantsMutator.isPending ||
                          emailRecipeantsMutator.isError,
                        loading: emailRecipeantsFetcher.isPending || emailRecipeantsMutator.isPending,
                        color: "error",
                        stretch: "fit",
                        padding: "3xs",
                        slim: true,
                        customTailwind: "ml-auto !aspect-square border border-error !border-solid",
                      }}
                    >
                      <IoMdRemoveCircleOutline className="text-s" />
                    </DefaultButton>
                  </div>
                );
              })
            ) : (
              <p className="w-full px-xs py-3xs text-alt-text">No recipients added</p>
            )}
            {emailRecipeantsMutator.isPending && (
              <div className="flex w-full animate-pulse flex-row items-center justify-start gap-3xs rounded-(--spacing-3xs) bg-foreground px-xs py-3xs text-text">
                <span className="text-s text-transparent">user@example.com</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
