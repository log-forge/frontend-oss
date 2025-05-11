import clsx from "clsx";
import React, { useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { type ModalSize, useModal } from "~/context/ModalContext";

export const modalSizePx: Record<ModalSize, number> = {
  xxsm: 340,
  xsm: 445.656,
  sm: 528,
  md: 620,
  lg: 792,
  xl: 990,
  full: 100,
  static_md: 620,
  static_lg: 792,
};

export const modalSizeClasses: Record<ModalSize, string> = {
  xxsm: "min-w-[min(340px,90%)] w-[25%] max-w-[90%]",
  xsm: "min-w-[min(445.656px,90%)] w-[33.3325%] max-w-[90%]",
  sm: "min-w-[min(528px,90%)] w-[40%] max-w-[90%]",
  md: "min-w-[min(620px,90%)] w-[46.3325%] max-w-[90%]",
  lg: "min-w-[min(792px,90%)] w-[60%] max-w-[90%]",
  xl: "min-w-[min(990px,90%)] w-[75%] max-w-[90%]",
  full: "w-full h-full",
  static_md: "min-w-[min(620px,90%)] w-[620px] max-w-[90%]",
  static_lg: "min-w-[min(792px,90%)] w-[792px] max-w-[90%]",
};

const Modal = React.memo(({ transitionTime, closeStyle }: { transitionTime: number; closeStyle: string }) => {
  const { modals, closeModal } = useModal();

  const [mouseDownOnMask, setMouseDownOnMask] = React.useState(false);

  useEffect(() => {
    // console.log("Modal state updated:", {
    // 	modalCount: modals.length,
    // 	modalKeys: modals.map((m) => m.key),
    // 	modalStates: modals.map((m) => ({
    // 		key: m.key,
    // 		isOpen: m.modalState.isOpen,
    // 		shouldShow: m.modalState.shouldShow,
    // 		isClosable: m.modalState.isClosable,
    // 		isDisabled: m.modalState.isDisabled,
    // 	})),
    // });
    // console.log("Modal component updated. Current modals:", modals);
    return () => {
      // console.log("Modal component unmounting. Last modals:", modals);
    };
  }, [modals]);

  if (modals.length === 0) return null; // No modals to display

  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full">
      {modals.map((modal, index) => {
        const isTopModal = index === modals.length - 1;

        return (
          <div
            key={`${modal.key}-${index}`}
            className={clsx(
              `modal-mask fixed inset-0 flex h-full w-full items-center justify-center backdrop-blur-sm transition-opacity duration-[0ms]`,
              modal.modalState.isOpen ? "opacity-100" : "opacity-0",
              isTopModal ? "pointer-events-auto z-50 bg-gray-800/60" : `pointer-events-none z-30 bg-gray-800/30`,
            )}
            onMouseDown={(e) => {
              if (e.target instanceof HTMLElement && e.target.classList.contains("modal-mask")) {
                setMouseDownOnMask(true);
              } else {
                setMouseDownOnMask(false);
              }
            }}
            onMouseUp={(e) => {
              if (
                mouseDownOnMask &&
                e.target instanceof HTMLElement &&
                e.target.classList.contains("modal-mask") &&
                isTopModal &&
                modal.modalState.isClosable
              ) {
                closeModal(modal.key);
              }
            }}
          >
            {modal.modalState.isOpen ? (
              <div
                style={{ transitionDuration: `${transitionTime}ms` }}
                className={clsx(
                  `default-modal relative max-h-screen transform rounded-(--spacing-xs) border border-dividers/20 bg-background p-md pt-[calc(var(--spacing-md)+var(--spacing-2xs)+var(--spacing-4xs))] text-text transition-all`,
                  `${modalSizeClasses[modal.modalState.size]}`,
                  modal.modalState.shouldShow ? "translate-y-0 scale-[100%]" : "translate-y-[calc(100vh-10%)] scale-[10%]",
                  modal.modalState.shouldShow ? "opacity-100" : "opacity-0",
                )}
                onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
              >
                {closeStyle === "pill-box" && isTopModal && modal.modalState.isClosable && (
                  <div
                    className="absolute top-2xs right-2xs flex h-md w-md items-center justify-center rounded-(--spacing-3xs) bg-accent text-text/80 transition-all hover:cursor-pointer hover:bg-accent/90 hover:text-text hover:shadow-md hover:shadow-dividers/20"
                    onClick={() => closeModal(modal.key)}
                  >
                    <CgClose className="h-[95%] w-[95%]" />
                  </div>
                )}
                {closeStyle === "rounded" && isTopModal && modal.modalState.isClosable && (
                  <div
                    className="rounded-button absolute top-xs right-xs flex h-md w-md items-center justify-center rounded-full bg-accent text-text/80 transition-all hover:cursor-pointer hover:bg-accent/90 hover:text-text hover:shadow-md hover:shadow-dividers/20"
                    onClick={() => closeModal(modal.key)}
                  >
                    <CgClose className="h-[90%] w-[90%]" />
                  </div>
                )}
                <div className="flex max-h-full flex-col items-center justify-start [overflow:overlay] overflow-auto">
                  {React.Children.map(modal.component, (child) => {
                    if (React.isValidElement(child)) {
                      return React.cloneElement(child as React.ReactElement<any>, {
                        ...(child.props as object),
                        modalState: modal.modalState,
                        modalKey: modal.key,
                        closeModal: () => closeModal(modal.key),
                      });
                    }

                    return child;
                  })}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
});

export default Modal;
