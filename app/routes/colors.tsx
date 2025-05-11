import { useState } from "react";
import { useTheme } from "~/context/ThemeContext";
import { FaClipboardList, FaCheck } from "react-icons/fa";
import clsx from "clsx";

export default function ColorsPage() {
  const { theme, setTheme } = useTheme();
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  // Hardcoded color tokens organized by palette
  const colorTokens = {
    primary: {
      default: "bg-primary",
      50: "bg-primary-50",
      100: "bg-primary-100",
      200: "bg-primary-200",
      300: "bg-primary-300",
      400: "bg-primary-400",
      500: "bg-primary-500",
      600: "bg-primary-600",
      700: "bg-primary-700",
      800: "bg-primary-800",
      900: "bg-primary-900",
      950: "bg-primary-950",
    },
    secondary: {
      default: "bg-secondary",
      50: "bg-secondary-50",
      100: "bg-secondary-100",
      200: "bg-secondary-200",
      300: "bg-secondary-300",
      400: "bg-secondary-400",
      500: "bg-secondary-500",
      600: "bg-secondary-600",
      700: "bg-secondary-700",
      800: "bg-secondary-800",
      900: "bg-secondary-900",
      950: "bg-secondary-950",
    },
    accent: {
      default: "bg-accent",
      50: "bg-accent-50",
      100: "bg-accent-100",
      200: "bg-accent-200",
      300: "bg-accent-300",
      400: "bg-accent-400",
      500: "bg-accent-500",
      600: "bg-accent-600",
      700: "bg-accent-700",
      800: "bg-accent-800",
      900: "bg-accent-900",
      950: "bg-accent-950",
    },
    background: {
      default: "bg-background",
      50: "bg-background-50",
      100: "bg-background-100",
      200: "bg-background-200",
      300: "bg-background-300",
      400: "bg-background-400",
      500: "bg-background-500",
      600: "bg-background-600",
      700: "bg-background-700",
      800: "bg-background-800",
      900: "bg-background-900",
      950: "bg-background-950",
    },
    middleground: {
      default: "bg-middleground",
      50: "bg-middleground-50",
      100: "bg-middleground-100",
      200: "bg-middleground-200",
      300: "bg-middleground-300",
      400: "bg-middleground-400",
      500: "bg-middleground-500",
      600: "bg-middleground-600",
      700: "bg-middleground-700",
      800: "bg-middleground-800",
      900: "bg-middleground-900",
      950: "bg-middleground-950",
    },
    foreground: {
      default: "bg-foreground",
      50: "bg-foreground-50",
      100: "bg-foreground-100",
      200: "bg-foreground-200",
      300: "bg-foreground-300",
      400: "bg-foreground-400",
      500: "bg-foreground-500",
      600: "bg-foreground-600",
      700: "bg-foreground-700",
      800: "bg-foreground-800",
      900: "bg-foreground-900",
      950: "bg-foreground-950",
    },
    text: {
      default: "bg-text",
      50: "bg-text-50",
      100: "bg-text-100",
      200: "bg-text-200",
      300: "bg-text-300",
      400: "bg-text-400",
      500: "bg-text-500",
      600: "bg-text-600",
      700: "bg-text-700",
      800: "bg-text-800",
      900: "bg-text-900",
      950: "bg-text-950",
    },
    "alt-text": {
      default: "bg-alt-text",
      50: "bg-alt-text-50",
      100: "bg-alt-text-100",
      200: "bg-alt-text-200",
      300: "bg-alt-text-300",
      400: "bg-alt-text-400",
      500: "bg-alt-text-500",
      600: "bg-alt-text-600",
      700: "bg-alt-text-700",
      800: "bg-alt-text-800",
      900: "bg-alt-text-900",
      950: "bg-alt-text-950",
    },
    "muted-text": {
      default: "bg-muted-text",
      50: "bg-muted-text-50",
      100: "bg-muted-text-100",
      200: "bg-muted-text-200",
      300: "bg-muted-text-300",
      400: "bg-muted-text-400",
      500: "bg-muted-text-500",
      600: "bg-muted-text-600",
      700: "bg-muted-text-700",
      800: "bg-muted-text-800",
      900: "bg-muted-text-900",
      950: "bg-muted-text-950",
    },
    dividers: {
      default: "bg-dividers",
      50: "bg-dividers-50",
      100: "bg-dividers-100",
      200: "bg-dividers-200",
      300: "bg-dividers-300",
      400: "bg-dividers-400",
      500: "bg-dividers-500",
      600: "bg-dividers-600",
      700: "bg-dividers-700",
      800: "bg-dividers-800",
      900: "bg-dividers-900",
      950: "bg-dividers-950",
    },
    highlight: {
      default: "bg-highlight",
      50: "bg-highlight-50",
      100: "bg-highlight-100",
      200: "bg-highlight-200",
      300: "bg-highlight-300",
      400: "bg-highlight-400",
      500: "bg-highlight-500",
      600: "bg-highlight-600",
      700: "bg-highlight-700",
      800: "bg-highlight-800",
      900: "bg-highlight-900",
      950: "bg-highlight-950",
    },
    interactive: {
      default: "bg-interactive",
      50: "bg-interactive-50",
      100: "bg-interactive-100",
      200: "bg-interactive-200",
      300: "bg-interactive-300",
      400: "bg-interactive-400",
      500: "bg-interactive-500",
      600: "bg-interactive-600",
      700: "bg-interactive-700",
      800: "bg-interactive-800",
      900: "bg-interactive-900",
      950: "bg-interactive-950",
    },
    success: {
      default: "bg-success",
      50: "bg-success-50",
      100: "bg-success-100",
      200: "bg-success-200",
      300: "bg-success-300",
      400: "bg-success-400",
      500: "bg-success-500",
      600: "bg-success-600",
      700: "bg-success-700",
      800: "bg-success-800",
      900: "bg-success-900",
      950: "bg-success-950",
    },
    warning: {
      default: "bg-warning",
      50: "bg-warning-50",
      100: "bg-warning-100",
      200: "bg-warning-200",
      300: "bg-warning-300",
      400: "bg-warning-400",
      500: "bg-warning-500",
      600: "bg-warning-600",
      700: "bg-warning-700",
      800: "bg-warning-800",
      900: "bg-warning-900",
      950: "bg-warning-950",
    },
    error: {
      default: "bg-error",
      50: "bg-error-50",
      100: "bg-error-100",
      200: "bg-error-200",
      300: "bg-error-300",
      400: "bg-error-400",
      500: "bg-error-500",
      600: "bg-error-600",
      700: "bg-error-700",
      800: "bg-error-800",
      900: "bg-error-900",
      950: "bg-error-950",
    },
  };

  // Color palettes to display
  const palettes = [
    { name: "Primary", prefix: "primary", description: "Main brand color, used for CTAs and important UI elements" },
    { name: "Secondary", prefix: "secondary", description: "Complementary color for secondary actions and accents" },
    { name: "Accent", prefix: "accent", description: "Special emphasis and highlighting" },
    { name: "Background", prefix: "background", description: "Page backgrounds and containers" },
    { name: "middleground", prefix: "middleground", description: "Cards, modals, and elevated middlegrounds" },
    { name: "Foreground", prefix: "foreground", description: "Content that sits on backgrounds" },
    { name: "Text", prefix: "text", description: "Primary text content" },
    { name: "Alt Text", prefix: "alt-text", description: "Alternative text with slight brand tint" },
    { name: "Muted Text", prefix: "muted-text", description: "Subdued text for less emphasis" },
    { name: "Dividers", prefix: "dividers", description: "Subtle separators between content" },
    { name: "Highlight", prefix: "highlight", description: "Subtle emphasis of content" },
    { name: "Interactive", prefix: "interactive", description: "Interactive elements like buttons and links" },
    { name: "Success", prefix: "success", description: "Positive feedback and confirmations" },
    { name: "Warning", prefix: "warning", description: "Warnings and cautionary messages" },
    { name: "error", prefix: "error", description: "Error states and warnings" },
  ];

  // Shades to display for each palette
  const shades = ["default", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background p-md text-text">
      <div className="mx-auto max-w-6xl">
        <div className="mb-lg flex items-center justify-between">
          <h1 className="text-h2 font-bold">Color Palette</h1>
          <button
            type="button"
            onClick={async () => await setTheme(theme === "light" ? "dark" : "light")}
            className="cursor-pointer rounded-full bg-middleground px-md py-xs transition-colors hover:bg-middleground-200"
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>

        <p className="mb-xl text-p">
          This page showcases all color variables defined in the design system. Click any color to copy its CSS variable to your clipboard.
        </p>

        <div className="mb-2xl">
          <div className="mb-md flex items-center gap-sm">
            <h2 className="text-h4 font-semibold text-highlight">Palette</h2>
            <p className="text-muted-text">All the colors of the palette in a grid</p>
          </div>

          {/* Add X-axis labels (shades) */}
          <div className="mb-4 flex overflow-hidden">
            <div className="mr-[8px] ml-2xs text-t text-transparent">middleground</div>
            {shades.map((shade) => (
              <div key={`x-label-${shade}`} className="w-xl max-w-full min-w-0 text-center text-t font-medium text-alt-text">
                {shade === "default" ? "Base" : shade}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Y-axis labels (palette prefixes) */}
            <div className="mt-[8px] mr-2xs flex flex-col">
              {palettes.map((palette) => (
                <div key={`y-label-${palette.prefix}`} className="flex h-xl flex-col items-start justify-center text-t font-medium text-muted-text">
                  {palette.prefix}
                </div>
              ))}
            </div>

            {/* Color grid */}
            <div className="relative grid h-fit w-fit grid-cols-12 gap-0 rounded-md border-8 border-dividers">
              {palettes.map((palette) =>
                shades.map((shade) => {
                  // Get the tailwind class from our hardcoded tokens
                  const tailwindClass = colorTokens[palette.prefix as keyof typeof colorTokens][shade as keyof typeof colorTokens.primary];
                  const displayShade = shade === "default" ? "" : shade;

                  return (
                    <div
                      key={`palette-${palette.prefix}-${shade}`}
                      className={clsx(
                        "rounded-0 group relative z-1 h-xl w-xl max-w-full transition-all hover:z-2 hover:scale-160 hover:rounded-(--spacing-3xs) hover:border hover:border-dividers hover:shadow-lg hover:shadow-dividers",
                        `${tailwindClass}`,
                      )}
                      onClick={() => copyToClipboard(tailwindClass)}
                    >
                      <div className="pointer-events-none absolute bottom-[105%] flex items-center justify-center rounded-(--spacing-3xs) bg-background/60 p-3xs text-t text-text opacity-0 transition-opacity group-hover:opacity-100">
                        {palette.prefix}
                        {displayShade ? `-${displayShade}` : ""}
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>

        {palettes.map((palette) => (
          <div key={palette.name} className="mb-2xl">
            <div className="mb-md flex items-center gap-sm">
              <h2 className="text-h4 font-semibold">{palette.name}</h2>
              <p className="text-muted-text">{palette.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {shades.map((shade) => {
                // Get the tailwind class from our hardcoded tokens
                const tailwindClass = colorTokens[palette.prefix as keyof typeof colorTokens][shade as keyof typeof colorTokens.primary];
                const displayShade = shade === "default" ? "" : shade;

                return (
                  <div key={shade} className="overflow-hidden rounded-md border border-dividers transition-shadow hover:shadow-md">
                    <div className={`h-xl ${tailwindClass} relative`} onClick={() => copyToClipboard(tailwindClass)}>
                      <button
                        className="absolute top-2 right-2 cursor-pointer rounded-full bg-background/80 p-2xs text-text transition-colors hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tailwindClass);
                        }}
                      >
                        {copiedValue === tailwindClass ? <FaCheck className="h-md w-md" /> : <FaClipboardList className="h-md w-md" />}
                      </button>
                    </div>
                    <div className="bg-middleground p-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{displayShade || "Default"}</span>
                        <button
                          className="flex cursor-pointer items-center gap-2xs text-sm text-muted-text transition-colors hover:text-text"
                          onClick={() => copyToClipboard(tailwindClass)}
                        >
                          {copiedValue === tailwindClass ? (
                            <>
                              <FaCheck className="h-sm w-sm" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <FaClipboardList className="h-sm w-sm" />
                              <span>Copy class</span>
                            </>
                          )}
                        </button>
                      </div>
                      <code className="mt-2xs block overflow-hidden text-sm text-ellipsis whitespace-nowrap text-alt-text">{tailwindClass}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-2xl border-t border-dividers pt-lg">
          <h2 className="mb-md text-h4 font-semibold">Brand Colors Reference</h2>
          <div className="mb-xl grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-6">
            {[
              { name: "Primary", color: colorTokens.primary.default },
              { name: "Secondary", color: colorTokens.secondary.default },
              { name: "Accent", color: colorTokens.accent.default },
              { name: "Success", color: colorTokens.success.default },
              { name: "Error", color: colorTokens.error.default },
              { name: "Neutral", color: colorTokens.dividers.default },
            ].map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-xs">
                <div className={`${item.color} h-lg w-lg rounded-full shadow-md`}></div>
                <span className="font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
