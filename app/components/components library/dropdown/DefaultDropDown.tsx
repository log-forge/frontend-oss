import clsx from "clsx";
import {
  componentFontSize,
  componentGap,
  componentMargin,
  componentPadding,
  componentPaddingBottom,
  componentPaddingLeft,
  componentPaddingRight,
  componentPaddingTop,
  componentPaddingX,
  componentPaddingY,
  componentRadius,
  componentRadiusBottomLeft,
  componentRadiusBottomRight,
  componentRadiusTopLeft,
  componentRadiusTopRight,
  type ComponentColors,
  type ComponentSize,
  type ComponentVariant,
} from "../Components.styles";
import { dropDownItemVariants, dropDownVariants } from "./DefaultDropDown.styles";
import { useEffect, useRef, useState } from "react";
import { useModal } from "~/context/ModalContext";

type DividerProps = {
  margin?: [Spacing, Spacing] | Spacing;
  variant?: ComponentVariant;
  color?: ComponentColors;
  attributes?: {};
};

/**
 * Dropdown Divider Component
 *
 * A simple divider to separate groups of dropdown items.
 */
export const DefaultDivider = ({ margin = "0", variant, color, attributes }: DividerProps) => {
  return (
    <hr
      className={clsx(
        "h-[1px] w-full border-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-dividers)30%,transparent),color-mix(in_oklab,var(--color-dividers)100%,transparent),color-mix(in_oklab,var(--color-dividers)30%,transparent))]",
        Array.isArray(margin)
          ? `${componentMargin.mt[margin[0]]} ${componentMargin.mb[margin[1]]}`
          : `${componentMargin.mt[margin]} ${componentMargin.mb[margin]}`,
      )}
      role="separator"
    />
  );
};

/**
 * Dropdown Item Component
 *
 * A component for individual dropdown menu items.
 */
type DropdownItemProps = {
  children: React.ReactNode;
  customTailwind?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ComponentVariant;
  color?: ComponentColors;
  slim?: boolean;
  padding?: [Spacing, Spacing, Spacing, Spacing] | [Spacing, Spacing] | Spacing;
  gap?: Spacing;
  radius?: [Spacing, Spacing, Spacing, Spacing] | Spacing;
  textSize?: FontSize;
  attributes?: {};
};

export function DropDownItem({
  children,
  customTailwind = "",
  onClick = () => {},
  disabled = false,
  loading = false,
  variant = "filled",
  color = "default",
  slim = false,
  padding = ["md", "2xs"],
  gap = "3xs",
  radius = "2xs",
  textSize = "s",
  attributes = {},
}: DropdownItemProps) {
  return (
    <div
      className={clsx(
        `${customTailwind} flex w-full flex-row items-center justify-center text-center outline-none`,
        `${componentGap[gap]}`,
        `${componentFontSize[textSize]}`,
        `${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`,
        `${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`,
        Array.isArray(padding)
          ? padding.length === 4
            ? clsx(
                `${componentPaddingTop[padding[0]]}`,
                `${componentPaddingRight[padding[1]]}`,
                `${componentPaddingBottom[padding[2]]}`,
                `${componentPaddingLeft[padding[3]]}`,
              )
            : `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}`
          : `${componentPadding[padding]}`,
        slim && `${componentPaddingY["4xs"]}`,
        Array.isArray(radius)
          ? clsx(
              `${componentRadiusTopLeft[radius[0]]}`,
              `${componentRadiusTopRight[radius[1]]}`,
              `${componentRadiusBottomLeft[radius[2]]}`,
              `${componentRadiusBottomRight[radius[3]]}`,
            )
          : `${componentRadius[radius]}`,
        variant !== "none" && `${dropDownItemVariants[variant][color]}`,
      )}
      {...attributes}
      role="menuitem"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      tabIndex={disabled || loading ? -1 : 0}
    >
      {children}
    </div>
  );
}

type DeafultDropDownProps = {
  renderTrigger: (
    triggerRef: React.RefObject<HTMLDivElement | HTMLButtonElement | null>,
    toggleDropdown: () => void,
    dropDownState: { isOpen: boolean; updatingPosition: boolean },
    triggerAttributes: {},
    triggerUpdatePosition: () => void,
  ) => React.ReactNode;
  renderOptions: ((
    key: string,
    toggleDropdown: () => void,
    dropDownState: { isOpen: boolean; updatingPosition: boolean },
    optionProps?: Partial<DropdownItemProps>,
  ) => React.ReactNode)[];
  onDropDownClose?: () => void;
  onDropDownOpen?: () => void;
  uniqueKey: string;
  disabled?: boolean;
  loading?: boolean;
  menuCustomTailwind?: string;
  position?: "top" | "bottom" | "bottom-left" | "bottom-right" | "top-left" | "top-right";
  variant?: ComponentVariant;
  color?: ComponentColors;
  menuStretch?: ComponentSize;
  padding?: [Spacing, Spacing, Spacing, Spacing] | [Spacing, Spacing] | Spacing;
  radius?: [Spacing, Spacing, Spacing, Spacing] | Spacing;
  gap?: Spacing;
  gapMargin?: Spacing;
  insetPercentage?: number;
  menuAttributes?: {};
  optionProps?: Partial<DropdownItemProps>;
};

// DefaultDropDown Component
// TODO:: Add support for keyboard navigation and accessibility features
export function DeafultDropDown({
  renderTrigger,
  renderOptions,
  uniqueKey,
  disabled = false,
  loading = false,
  onDropDownClose = () => {},
  onDropDownOpen = () => {},
  menuCustomTailwind = "",
  position = "bottom",
  variant = "filled",
  color = "default",
  menuStretch = "fit",
  padding = "2xs",
  radius = "3xs",
  gap = "2xs",
  gapMargin = "3xs",
  insetPercentage = 0,
  menuAttributes = {},
  optionProps = {},
}: DeafultDropDownProps) {
  const { isDisabled, isTransitioning } = useModal();
  const triggerRef = useRef<HTMLDivElement>(null);
  const posMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [menuStyles, setMenuStyles] = useState<React.CSSProperties>({});
  const [updatingPosition, setUpdatingPosition] = useState<boolean>(false);

  // Update menu position when parameters or trigger position changes
  useEffect(() => {
    if (!isDisabled && !isTransitioning) updateMenuPosition();
  }, [menuStretch, position, isOpen, isDisabled, isTransitioning]); // Add triggerRect as dependency

  // Close dropdown when clicking outside and position the menu when it opens
  // Update menu position when the window resizes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInMenu = menuRef.current && menuRef.current.contains(event.target as Node);
      const isClickInDropdown = triggerRef.current && triggerRef.current.contains(event.target as Node);

      if (!isClickInDropdown && !isClickInMenu && isOpen) {
        // console.log ("Click outside detected, closing dropdown.");
        setIsOpen(false);
      }
    };

    const handleResize = () => updateMenuPosition();
    const handleScroll = () => updateMenuPosition();

    if (isOpen) {
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true); // true for capture phase to catch all scroll events
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (isOpen) {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      }
    };
  }, [isOpen]);

  // Keyboard navigation handling
  useEffect(() => {
    // 	const handleKeyDown = (event: KeyboardEvent) => {
    // 		if (!isOpen) return;
    // 		switch (event.key) {
    // 			case "Escape":
    // 				setIsOpen(false);
    // 				triggerRef.current?.focus();
    // 				break;
    // 			case "Tab":
    // 				// We'll let the default behavior handle tab navigation
    // 				break;
    // 			case "ArrowDown":
    // 				event.preventDefault();
    // 				// Focus first menu item or next menu item
    // 				const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])');
    // 				if (menuItems && menuItems.length > 0) {
    // 					const currentIndex = Array.from(menuItems).findIndex((item) => document.activeElement === item);
    // 					if (currentIndex === -1 || currentIndex === menuItems.length - 1) {
    // 						// Focus first item if none is focused or we're at the end
    // 						(menuItems[0] as HTMLElement).focus();
    // 					} else {
    // 						// Focus next item
    // 						(menuItems[currentIndex + 1] as HTMLElement).focus();
    // 					}
    // 				}
    // 				break;
    // 			case "ArrowUp":
    // 				event.preventDefault();
    // 				// Focus last menu item or previous menu item
    // 				const upMenuItems = menuRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])');
    // 				if (upMenuItems && upMenuItems.length > 0) {
    // 					const currentIndex = Array.from(upMenuItems).findIndex((item) => document.activeElement === item);
    // 					if (currentIndex === -1 || currentIndex === 0) {
    // 						// Focus last item if none is focused or we're at the beginning
    // 						(upMenuItems[upMenuItems.length - 1] as HTMLElement).focus();
    // 					} else {
    // 						// Focus previous item
    // 						(upMenuItems[currentIndex - 1] as HTMLElement).focus();
    // 					}
    // 				}
    // 				break;
    // 			case "Home":
    // 				event.preventDefault();
    // 				// Focus first menu item
    // 				const firstMenuItem = menuRef.current?.querySelector('[role="menuitem"]:not([disabled])') as HTMLElement;
    // 				firstMenuItem?.focus();
    // 				break;
    // 			case "End":
    // 				event.preventDefault();
    // 				// Focus last menu item
    // 				const menuItemsForEnd = menuRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])');
    // 				if (menuItemsForEnd && menuItemsForEnd.length > 0) {
    // 					(menuItemsForEnd[menuItemsForEnd.length - 1] as HTMLElement).focus();
    // 				}
    // 				break;
    // 		}
    // 	};
    // 	document.addEventListener("keydown", handleKeyDown);
    // 	return () => {
    // 		document.removeEventListener("keydown", handleKeyDown);
    // 	};
  }, [isOpen]);

  // Toggle dropdown
  const toggleDropdown = () => {
    if (disabled || loading) return;

    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      setTimeout(() => onDropDownOpen(), 0); // Call the open callback
      setUpdatingPosition(true); // Set updating position to true immediately when opening

      // Position the menu based on trigger position
      setTimeout(() => {
        updateMenuPosition();
        // Focus the first menu item after the menu has been positioned
        // setTimeout(() => {
        // 	const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
        // 	if (menuItems?.length) {
        // 		(menuItems[0] as HTMLElement).focus();
        // 	}
        // }, 50);
      }, 0);
    } else setTimeout(() => onDropDownClose(), 0); // Call the close callback
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // if (!isOpen || !menuRef.current) return;
    // const menuItems = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]:not([tabindex="-1"])'));
    // if (!menuItems.length) return;
    // const currentIndex = menuItems.indexOf(document.activeElement as Element);
    // let nextIndex: number;
    // switch (event.key) {
    // 	case "ArrowDown":
    // 		event.preventDefault();
    // 		nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % menuItems.length;
    // 		(menuItems[nextIndex] as HTMLElement).focus();
    // 		break;
    // 	case "ArrowUp":
    // 		event.preventDefault();
    // 		nextIndex = currentIndex < 0 ? menuItems.length - 1 : (currentIndex - 1 + menuItems.length) % menuItems.length;
    // 		(menuItems[nextIndex] as HTMLElement).focus();
    // 		break;
    // 	case "Home":
    // 		event.preventDefault();
    // 		(menuItems[0] as HTMLElement).focus();
    // 		break;
    // 	case "End":
    // 		event.preventDefault();
    // 		(menuItems[menuItems.length - 1] as HTMLElement).focus();
    // 		break;
    // 	case "Escape":
    // 		event.preventDefault();
    // 		setIsOpen(false);
    // 		triggerRef.current?.focus();
    // 		break;
    // 	case "Tab":
    // 		// Allow normal tab behavior but close the dropdown
    // 		setIsOpen(false);
    // 		break;
    // }
  };

  // Update menu position when it opens
  const updateMenuPosition = () => {
    if (!triggerRef.current || !posMenuRef.current) return;

    const actualTriggerRect = triggerRef.current.getBoundingClientRect(); // Use the latest trigger rect
    if (!actualTriggerRect) return; // No valid rectangle available
    // console.log ("Trigger rect:", actualTriggerRect);
    const menuRect = posMenuRef.current.getBoundingClientRect();
    // console.log ("Menu rect:", menuRect);
    // Get viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const menuWidth = menuStretch === "full" ? actualTriggerRect.width : menuRect.width;

    // Calculate position based on the position prop
    let top, left;

    // Handle vertical positioning (top vs bottom)
    if (position.startsWith("top")) {
      // Position above the trigger
      top = actualTriggerRect.top - menuRect.height;
    } else {
      // Position below the trigger (default)
      top = actualTriggerRect.bottom;
    }

    // Handle horizontal positioning (left, right, center)
    if (position.includes("right")) {
      // Align the right side of menu with right side of trigger
      left = actualTriggerRect.right - menuRect.width;
      left = left - (insetPercentage / 100) * actualTriggerRect.width || 0;
    } else if (position.includes("left")) {
      // Align the left side of menu with left side of trigger
      left = actualTriggerRect.left;
      left = left + (insetPercentage / 100) * actualTriggerRect.width || 0;
    } else {
      // Center horizontally (default)
      left = actualTriggerRect.left + actualTriggerRect.width / 2 - menuWidth / 2;
    }

    // Ensure the menu stays within viewport bounds
    if (left < 0) left = 0;
    if (left + menuRect.width > viewportWidth) left = viewportWidth - menuRect.width;
    if (top < 0) top = 0;
    if (top + menuRect.height > viewportHeight) top = viewportHeight - menuRect.height;

    // Apply calculated position
    setMenuStyles({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: menuStretch === "full" ? `${actualTriggerRect.width}px` : "auto",
      zIndex: 50,
    });
    // console.log ("Menu styles updated:", {
    //   position: "fixed",
    //   top: `${top}px`,
    //   left: `${left}px`,
    //   width: menuStretch === "full" ? `${actualTriggerRect.width}px` : "auto",
    //   zIndex: 50,
    // });

    // Allow a brief moment for the menu to be positioned before making it visible
    setTimeout(() => {
      setUpdatingPosition(false);
    }, 50);
  };

  return (
    <>
      {renderTrigger(
        triggerRef,
        toggleDropdown,
        { isOpen, updatingPosition },
        { "aria-expanded": isOpen, "aria-haspopup": "true" },
        updateMenuPosition,
      )}
      {/* Invisible menu for position calculation */}
      <div
        key={JSON.stringify(menuStyles)} // Add a key that changes with menuStyles to force re-render
        ref={posMenuRef}
        className={clsx(
          `${menuCustomTailwind} pointer-events-none fixed -z-100 overflow-hidden opacity-0 select-none`,
          Array.isArray(padding)
            ? padding.length === 4
              ? clsx(
                  `${componentPaddingTop[padding[0]]}`,
                  `${componentPaddingRight[padding[1]]}`,
                  `${componentPaddingBottom[padding[2]]}`,
                  `${componentPaddingLeft[padding[3]]}`,
                )
              : `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}`
            : `${componentPadding[padding]}`,
          variant !== "none" && `${dropDownVariants[variant][color]}`,
        )}
        style={{ ...menuStyles }}
        tabIndex={-1}
      >
        {renderOptions.map((renderOption, index) => {
          return renderOption(
            `dropdown-option-${uniqueKey}-${index}`,
            toggleDropdown,
            { isOpen, updatingPosition },
            { ...optionProps, disabled: true, loading: true, customTailwind: "opacity-0 pointer-events-none select-none" },
          );
        })}
      </div>
      {/* Actual menu */}
      {/* Use createPortal to render at the root of the document */}
      {isOpen && (
        <div
          key={`${JSON.stringify(menuStyles)}-real`}
          ref={menuRef}
          className={clsx(
            `fixed z-50 flex flex-col items-start justify-start overflow-hidden ${menuCustomTailwind}`,
            `${componentGap[gap]}`,
            position === "bottom"
              ? `origin-top ${componentMargin.mt[gapMargin]}`
              : position === "bottom-left"
                ? `origin-top-left ${componentMargin.mt[gapMargin]}`
                : position === "bottom-right"
                  ? `origin-top-right ${componentMargin.mt[gapMargin]}`
                  : position === "top"
                    ? `origin-bottom ${componentMargin.mb[gapMargin]}`
                    : position === "top-left"
                      ? `origin-bottom-left ${componentMargin.mb[gapMargin]}`
                      : `origin-bottom-right ${componentMargin.mb[gapMargin]}`,
            updatingPosition ? "pointer-events-none origin-top scale-60 opacity-0" : "pointer-events-auto scale-100 opacity-100", // Add scale transformation
            "transition-all duration-150 ease-out", // Smooth transition for both scale and opacity
            Array.isArray(padding)
              ? padding.length === 4
                ? clsx(
                    `${componentPaddingTop[padding[0]]}`,
                    `${componentPaddingRight[padding[1]]}`,
                    `${componentPaddingBottom[padding[2]]}`,
                    `${componentPaddingLeft[padding[3]]}`,
                  )
                : `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}`
              : `${componentPadding[padding]}`,
            Array.isArray(radius)
              ? clsx(
                  `${componentRadiusTopLeft[radius[0]]}`,
                  `${componentRadiusTopRight[radius[1]]}`,
                  `${componentRadiusBottomLeft[radius[2]]}`,
                  `${componentRadiusBottomRight[radius[3]]}`,
                )
              : `${componentRadius[radius]}`,
            variant !== "none" && `${dropDownVariants[variant][color]}`,
          )}
          style={{ ...menuStyles }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-button"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          {...menuAttributes}
        >
          {renderOptions.map((renderOption, index) => {
            return renderOption(
              `dropdown-option-${uniqueKey}-${index}`,
              toggleDropdown,
              { isOpen, updatingPosition },
              { ...optionProps, disabled: optionProps?.disabled || updatingPosition },
            );
          })}
        </div>
      )}
    </>
  );
}
