import React, { useMemo, useRef } from "react";
import clsx from "clsx";
import {
	componentRadius,
	componentRadiusBottomLeft,
	componentRadiusBottomRight,
	componentRadiusTopLeft,
	componentRadiusTopRight,
	componentPadding,
	componentColors,
	componentStretchW,
	componentStretchH,
	type ComponentSize,
	componentPaddingX,
	componentPaddingY,
	componentColorUtils,
} from "../Components.styles";

export const profileIconSizeClasses: Record<Spacing, string> = {
	"4xs": "w-4xs h-4xs",
	"3xs": "w-3xs h-3xs",
	"2xs": "w-2xs h-2xs",
	xs: "w-xs h-xs",
	sm: "w-sm h-sm",
	md: "w-md h-md",
	lg: "w-lg h-lg",
	xl: "w-xl h-xl",
	"2xl": "w-2xl h-2xl",
	"3xl": "w-3xl h-3xl",
	"4xl": "w-4xl h-4xl",
};

type DefaultProfileIconProps = {
	name: string;
	seed?: string;
	size?: [ComponentSize, ComponentSize] | ComponentSize | Spacing;
	radius?: [Spacing, Spacing, Spacing, Spacing] | Spacing | "full";
	padding?: [Spacing, Spacing] | Spacing;
	customTailwind?: string;
	textSize?: FontSize;
	textColor?: string;
	disabled?: boolean;
	onClick?: () => void;
	attributes?: {};
	ref?: React.Ref<HTMLDivElement>;
};

const DefaultProfileIcon = ({
	name,
	seed,
	size = ["fit", "full"],
	radius = "full",
	padding = "3xs",
	customTailwind = "",
	textColor = "text-text",
	disabled = false,
	onClick,
	attributes = {},
	ref,
}: DefaultProfileIconProps) => {
	// Get initials from name
	const initials = useMemo(() => {
		if (!name) return "";

		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	}, [name]);

	// Generate consistent color based on seed or name
	const backgroundColor = useMemo(() => {
		// Use provided seed or fall back to name
		const colorSeed = seed || name;

		// Simple hash function to create a consistent number from the string
		const hashCode = colorSeed.split("").reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);
		// Use the hash to select from a predefined set of colors
		const colors = Object.keys(componentColors)
			.map((key) => {
				if (componentColors[key] != "background" && componentColors[key] != "foreground") {
					return `${componentColors[key]}`;
				}
			})
			.filter(Boolean);

		const index = Math.abs(hashCode) % colors.length;
		return colors[index] || "accent";
	}, [seed, name]);

	// Create SVG with the initials
	const svgContent = useMemo(() => {
		// Calculate if background color is light or dark based on color name
		// Colors with high numbers (100-300) or light-associated names are likely light
		const isLightBackground = (() => {
			const color = componentColorUtils.bg[backgroundColor].toLowerCase();

			// Check for colors that typically indicate light shades
			if (/(?:50|100|200|300)$/.test(color)) {
				return true; // Colors ending with 50-300 are usually light
			}

			// Check for explicitly light color names
			if (/(?:white|yellow|lime|cyan|sky|emerald|teal|light)/.test(color)) {
				return true;
			}

			// Check for explicitly dark color names
			if (/(?:950|900|800|700|600|black|dark)/.test(color)) {
				return false; // Colors ending with 600-950 are usually dark
			}

			// Colors in the middle (400-500) or without clear indicators default to dark
			// This ensures text is readable in ambiguous cases
			return false;
		})();

		console.log("Background color:", backgroundColor, "Is light background:", isLightBackground);
		// Use dark text for light backgrounds, light text for dark backgrounds
		const textFillColor = isLightBackground ? "#111827" : "#FFFFFF";

		return `
		  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40">
			<text
			  x="50%"
			  y="50%"
			  dominant-baseline="central"
			  text-anchor="middle"
			  font-family="ui-sans-serif, system-ui, sans-serif"
			  font-size="16"
			  font-weight="bold"
			  fill="${textFillColor}"
			>
			  ${initials}
			</text>
		  </svg>
		`;
	}, [initials, backgroundColor]);

	// Create a safely encoded data URL for the SVG
	const svgDataUrl = useMemo(() => {
		const encoded = encodeURIComponent(svgContent).replace(/'/g, "%27").replace(/"/g, "%22");

		return `data:image/svg+xml,${encoded}`;
	}, [svgContent]);

	return (
		<div
			ref={ref || undefined}
			className={clsx(
				`${customTailwind} flex items-center justify-center overflow-hidden select-none aspect-square hover:shadow-lg hover:shadow-dividers/20 transition-shadow duration-300`,
				`${textColor}`,
				`${componentColorUtils.bg[backgroundColor]}`,
				typeof size === "string" && !["full", "fit"].includes(size)
					? profileIconSizeClasses[size]
					: Array.isArray(size)
					? `${componentStretchW[size[0]]} ${componentStretchH[size[1]]}`
					: `${componentStretchW[size]} ${componentStretchH[size]}`,
				Array.isArray(padding) ? `${componentPaddingX[padding[0]]} ${componentPaddingY[padding[1]]}` : `${componentPadding[padding]}`, // Add padding for better text fit
				Array.isArray(radius)
					? clsx(
							`${componentRadiusTopLeft[radius[0]]}`,
							`${componentRadiusTopRight[radius[1]]}`,
							`${componentRadiusBottomLeft[radius[2]]}`,
							`${componentRadiusBottomRight[radius[3]]}`
					  )
					: radius === "full"
					? "rounded-full"
					: `${componentRadius[radius]}`,
				disabled ? "opacity-50" : "cursor-pointer"
			)}
			onClick={disabled ? undefined : onClick}
			style={{
				backgroundImage: `url("${svgDataUrl}")`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				backgroundSize: "200%", // Adjust this value to fit your container
			}}
			{...attributes}
		/>
	);
};

export default DefaultProfileIcon;
