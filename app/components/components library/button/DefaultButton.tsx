import React from "react";
import clsx from "clsx";
import { buttonVariants } from "./DefaultButton.styles";
import {
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
  componentStretchH,
  componentStretchW,
  type ComponentColors,
  type ComponentSize,
  type ComponentVariant,
} from "../Components.styles";
import { BsThreeDots } from "react-icons/bs";

type ButtonTypes = "button" | "submit";
export type DefaultButtonProps = {
  children: React.ReactNode;
  type?: ButtonTypes;
  customTailwind?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ComponentVariant;
  color?: ComponentColors;
  stretch?: [ComponentSize, ComponentSize] | ComponentSize;
  padding?: [Spacing, Spacing, Spacing, Spacing] | [Spacing, Spacing] | Spacing;
  radius?: [Spacing, Spacing, Spacing, Spacing] | Spacing;
  slim?: boolean;
  attributes?: {};
  ref?: React.Ref<HTMLButtonElement>;
};

const DefaultButton: React.FC<DefaultButtonProps> = ({
  children,
  type = "button",
  customTailwind = "",
  onClick = (e) => {},
  disabled = false,
  loading = false,
  variant = "filled",
  color = "default",
  stretch = "fit",
  padding = "2xs",
  radius = "3xs",
  slim = false,
  attributes = {},
  ref,
}: DefaultButtonProps) => {
  return (
    <button
      ref={ref || undefined}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        `${customTailwind} group relative flex max-w-full cursor-pointer flex-row items-center justify-center truncate border-none text-center align-middle font-sans text-p outline-none select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`,
        Array.isArray(stretch) ? `${componentStretchW[stretch[0]]} ${componentStretchH[stretch[1]]}` : `${componentStretchW[stretch]}`,
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
        !slim && `${Array.isArray(padding) ? componentPaddingY[padding[1]] : componentPaddingY[padding]}`,
        slim && `${componentPaddingY["4xs"]}`,
        Array.isArray(radius)
          ? clsx(
              `${componentRadiusTopLeft[radius[0]]}`,
              `${componentRadiusTopRight[radius[1]]}`,
              `${componentRadiusBottomLeft[radius[2]]}`,
              `${componentRadiusBottomRight[radius[3]]}`,
            )
          : `${componentRadius[radius]}`,
        variant !== "none" && `${buttonVariants[variant][color]}`,
      )}
      {...attributes}
    >
      {loading && (
        <div className="absolute top-0 right-0 bottom-0 left-0 flex w-full animate-pulse flex-col items-center justify-center bg-highlight/60">
          <div className="flex h-full w-full flex-col items-center justify-center text-highlight-200 light:text-highlight-800">
            <BsThreeDots className="text-highlight-200 light:text-highlight-800" />
          </div>
        </div>
      )}
      {loading ? <span className="flex opacity-0">{children}</span> : children}
    </button>
  );
};

export default DefaultButton;
