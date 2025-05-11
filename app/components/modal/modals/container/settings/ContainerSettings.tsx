import clsx from "clsx";
import { useEffect, useState } from "react";
import { modalSizePx } from "~/components/modal/Modal";
import { IoChevronBack } from "react-icons/io5";
import { type ModalState } from "~/context/ModalContext";
import useWindowDimensions from "~/hooks/useWindowDimensions";
import DefaultButton from "~/components/components library/button/DefaultButton";
import RecipientsSettings from "./sub settings/RecipientsSettings";

const availableOptions = ["recipients"];

export default function ContainerSettings(props: any) {
  const { windowDimensions } = useWindowDimensions();

  const [paginated, setPaginated] = useState(false);
  const [prevSetting, setPrevSetting] = useState(availableOptions[0]);
  const [activeSetting, setActiveSetting] = useState(availableOptions[0]);

  const { modalState, modalKey } = props;
  const { size } = modalState as ModalState;
  const modalSize = modalSizePx[size];

  useEffect(() => {
    if (windowDimensions.width < modalSize) {
      setPrevSetting(activeSetting);
      setPaginated(true);
    } else {
      setPrevSetting(activeSetting || "recipients");
      setPaginated(false);
    }

    return () => {};
  }, [windowDimensions]);

  useEffect(() => {
    if (paginated) {
      setActiveSetting("");
    } else {
      setActiveSetting(prevSetting);
    }

    return () => {};
  }, [paginated]);

  return (
    <div className="flex h-[auto] min-h-[calc(10*var(--spacing-lg))] w-full flex-row justify-start bg-transparent text-text">
      {activeSetting && paginated && (
        <div
          className="absolute top-2xs left-2xs flex h-[calc(0.95*var(--spacing-md))] w-[calc(0.95*var(--spacing-md))] cursor-pointer items-center justify-center"
          onClick={() => setActiveSetting("")}
        >
          <IoChevronBack className="h-full w-full" />
        </div>
      )}
      <div
        className={clsx(
          "settings-menu-panel flex-col justify-start gap-2xs pt-xs",
          !paginated && "!flex !w-fit items-start border-r border-dividers/60 pr-xs",
          !activeSetting && paginated ? "flex w-full items-center" : "hidden",
        )}
      >
        {availableOptions.map((option) => (
          <DefaultButton
            key={`${option}-settings-button`}
            onClick={() => setActiveSetting(option)}
            slim={true}
            padding="3xs"
            variant="text"
            stretch="full"
            {...{
              customTailwind: `!pr-lg !pl-sm min-w-[calc(13*var(--fontSize-t))] text-[calc(1.1*var(--fontSize-t))] ${
                activeSetting === option ? "!bg-foreground/100 active:!bg-foreground/100 !font-medium" : ""
              }`,
            }}
          >
            <div className={clsx("flex w-full flex-col justify-start hover:font-medium", paginated ? "items-center" : "items-start")}>
              {option.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              <div className="pointer-events-none h-0 font-medium text-transparent opacity-0 select-none" tabIndex={-1}>
                {/* This is a hidden element to help with screen readers */}
                {option.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              </div>
            </div>
          </DefaultButton>
        ))}
      </div>
      <div
        className={clsx(
          "settings-view-panel w-full flex-col items-start justify-start",
          !paginated && "!flex py-xs pl-lg",
          activeSetting && paginated ? "flex" : "hidden",
        )}
      >
        {activeSetting === "recipients" && <RecipientsSettings />}
      </div>
    </div>
  );
}
