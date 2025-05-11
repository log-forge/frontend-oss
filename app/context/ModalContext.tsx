import React, { createContext, useCallback, useContext, useState } from "react";

export type ModalSize = "xxsm" | "xsm" | "sm" | "md" | "lg" | "xl" | "full" | "static_md" | "static_lg";
export interface ModalState {
  isOpen: boolean;
  shouldShow: boolean;
  isClosable: boolean;
  isDisabled: boolean;
  size: ModalSize;
}
export interface Modal {
  component: React.ReactNode;
  key: string; // Unique identifier for the modal
  modalState: ModalState;
}
export interface ModalProps {
  modalKey: string; // Unique identifier for the modal
  modalState: ModalState;
  closeModal: () => void;
}
interface ModalContextProps {
  modals: Modal[];
  isModalOpen: (key: string) => boolean;
  isComponentOpen: (componentType: React.ComponentType<any>) => boolean;
  openModal: (component: React.ReactNode, size?: ModalSize, isClosable?: boolean, key?: string, onAnimationComplete?: () => void) => void;
  closeModal: (key: string) => void;
  transitionToModal: (component: React.ReactNode, size?: ModalSize, isClosable?: boolean, key?: string) => void;
  disabledState: (newState: boolean) => void;
  isDisabled: boolean;
  isTransitioning: boolean;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ transitionTime, children }: { transitionTime: number; children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [modals, setModals] = useState<Modal[]>([]);

  /**
   * Check if a modal with the specified key is currently open
   * @param key The unique key of the modal to check
   * @returns boolean True if the modal is open, false otherwise
   */
  const isModalOpen = useCallback(
    (key: string): boolean => {
      // Find a modal with matching key that's currently open
      return modals.some((modal) => modal.key === key && modal.modalState.isOpen && modal.modalState.shouldShow);
    },
    [modals],
  );

  /**
   * Check if a modal of a specific component type is currently open
   * @param componentType The component type to check for
   * @returns boolean True if a modal of the specified component type is open, false otherwise
   */
  const isComponentOpen = useCallback(
    (componentType: React.ComponentType<any>): boolean => {
      // Check if any modal contains a component of the specified type
      return modals.some((modal) => {
        // Get component type from the modal
        const modalComponentType = React.isValidElement(modal.component) ? modal.component.type : null;

        // Check if the modal is open and its component type matches
        return modalComponentType === componentType && modal.modalState.isOpen && modal.modalState.shouldShow;
      });
    },
    [modals],
  );

  /**
   * Opens a modal by adding it to the modal stack and sequentially updating its state to display with animations.
   *
   * @param component - The React component to render inside the modal.
   * @param size - The modal's size (default "md").
   * @param isClosable - Whether the modal can be closed by the user (default true).
   * @param key - A unique identifier for the modal (default generated from the current timestamp).
   * @param onAnimationComplete - Optional callback to be called when the modal opening animation completes.
   */
  const openModal = useCallback(
    (
      component: React.ReactNode,
      size: ModalSize = "md",
      isClosable: boolean = true,
      key: string = Date.now().toString(),
      onAnimationComplete?: () => void,
    ) => {
      if (!isDisabled && !isTransitioning) {
        setIsTransitioning(true);
        setIsDisabled(true);

        const modalState: ModalState = {
          isOpen: false,
          shouldShow: false,
          isClosable,
          isDisabled: true,
          size,
        };
        // Step 1: Add the modal to the stack
        setModals((prev) => [
          ...prev.map((modal, index, arr) => ({
            ...modal,
            modalState: {
              ...modal.modalState,
              isDisabled: true, // Disable all but the last modal in the stack
            },
          })),
          { component, key, modalState },
        ]);

        // Step 2: Display the modal
        setModals((prev) =>
          prev.map((modal) =>
            modal.key === key
              ? {
                  ...modal,
                  modalState: { ...modal.modalState, isOpen: true },
                }
              : modal,
          ),
        );

        setTimeout(() => {
          // Step 3: Start the opening animation after 10 ms of add modal
          setModals((prev) =>
            prev.map((modal) =>
              modal.key === key
                ? {
                    ...modal,
                    modalState: { ...modal.modalState, shouldShow: true },
                  }
                : modal,
            ),
          );

          setTimeout(() => {
            // Step 4: Enable the recently added modal
            setModals((prev) =>
              prev.map((modal) =>
                modal.key === key
                  ? {
                      ...modal,
                      modalState: { ...modal.modalState, isDisabled: false },
                    }
                  : modal,
              ),
            );

            setIsTransitioning(false);
            setIsDisabled(false);

            if (onAnimationComplete) onAnimationComplete();
          }, transitionTime);
        }, 10);
      }
    },
    [isDisabled, isTransitioning],
  );

  /**
   * Closes a modal identified by its key if the UI is not disabled or transitioning.
   *
   * This function performs the following steps:
   * 1. Starts the closing animation by updating the modal's state to not show.
   * 2. After the animation delay, hides the modal.
   * 3. Removes the modal from the state and updates the disabled state for the remaining modal stack.
   *
   * @param key - The unique identifier of the modal to be closed.
   */
  const closeModal = useCallback(
    (key: string) => {
      // console.log("closeModal called with key:", key, "isDisabled:", isDisabled, "isTransitioning:", isTransitioning);

      if (!isDisabled && !isTransitioning) {
        // console.log("📢 ACTUALLY CLOSING MODAL:", key);
        setIsTransitioning(true);
        setIsDisabled(true);

        // Step 1: Start the closing animation
        setModals((prev) =>
          prev.map((modal) =>
            modal.key === key
              ? {
                  ...modal,
                  modalState: {
                    ...modal.modalState,
                    shouldShow: false,
                    isDisabled: true,
                  },
                }
              : modal,
          ),
        );

        setTimeout(() => {
          // Step 2: Hide the modal after animation ends
          setModals((prev) =>
            prev.map((modal) =>
              modal.key === key
                ? {
                    ...modal,
                    modalState: { ...modal.modalState, isOpen: false },
                  }
                : modal,
            ),
          );

          // Step 3: Remove the modal and update `isDisabled` for the stack
          setModals((prev) => {
            const updatedModals = prev.filter((modal) => modal.key !== key);

            return updatedModals.map((modal, index) => ({
              ...modal,
              modalState: {
                ...modal.modalState,
                isDisabled: index !== updatedModals.length - 1, // Enable only the top modal
              },
            }));
          });
          setIsTransitioning(false);
          setIsDisabled(false);
        }, transitionTime); // Delay matches the animation duration
      } else {
        // console.log("❌ NOT closing modal due to disabled/transitioning state");
      }
    },
    [isDisabled, isTransitioning],
  );

  /**
   * Transitions from the current modal to a new modal.
   *
   * Closes the currently active modal (if any), then, after a delay matching the closing animation duration,
   * opens the provided modal component. This transition only occurs if modals are enabled and not currently transitioning.
   *
   * @param component - The React node to be rendered as the new modal.
   * @param size - The size of the modal, with a default value of "md".
   * @param isClosable - Indicates whether the modal can be manually closed, defaulting to true.
   * @param key - A unique identifier for the modal, defaulting to the current timestamp string.
   */
  const transitionToModal = useCallback(
    (component: React.ReactNode, size: ModalSize = "md", isClosable: boolean = true, key: string = Date.now().toString()) => {
      if (!isDisabled && !isTransitioning) {
        const currentModalKey = modals[modals.length - 1]?.key;

        if (currentModalKey) {
          // Step 1: Close the current modal
          closeModal(currentModalKey);

          // Step 2: Open the new modal after a slight delay
          setTimeout(() => {
            openModal(component, size, isClosable, key);
          }, transitionTime); // Delay matches the closing animation duration
        }
      }
    },
    [modals, closeModal, openModal, isDisabled, isTransitioning],
  );

  /**
   * Updates the disabled state.
   *
   * @param newState - The new boolean value for the disabled state.
   */
  const disabledState = (newState: boolean) => {
    // console.log("disabledState changing from", isDisabled, "to", newState);
    setIsDisabled(newState);
  };

  return (
    <ModalContext.Provider
      value={{
        modals,
        isModalOpen,
        isComponentOpen,
        openModal,
        closeModal,
        transitionToModal,
        disabledState,
        isDisabled,
        isTransitioning,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");

  return context;
};
