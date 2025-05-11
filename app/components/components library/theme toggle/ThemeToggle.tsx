import { useTheme } from "~/context/ThemeContext";
import DefaultButton from "../button/DefaultButton";
import type { Theme } from "~/utils/cookies/theme.server";
import { useEffect, useState } from "react";
import { MdLightMode, MdDarkMode, MdComputer } from "react-icons/md";

export default function ThemeToggle({ customTailwind = "" }: { customTailwind?: string }) {
  const { theme, settingTheme, toggleTheme } = useTheme();

  const [currentTheme, setCurrentTheme] = useState<Theme>(theme);

  useEffect(() => {
    if (currentTheme != theme) setCurrentTheme(theme);
  }, [theme]);

  const themes = [
    { value: "light", label: "Light", component: <MdLightMode key={"light-theme-toggle"} /> },
    { value: "dark", label: "Dark", component: <MdDarkMode key={"dark-theme-toggle"} /> },
    { value: "system", label: "System", component: <MdComputer key={"system-theme-toggle"} /> },
  ];

  return (
    <DefaultButton
      {...{
        disabled: settingTheme,
        loading: settingTheme,
        stretch: "fit",
        radius: "3xs",
        color: "accent",
        customTailwind,
        attributes: { "aria-label": "Toggle theme" },
      }}
    >
      <div onClick={toggleTheme} className="flex flex-row items-center justify-center text-p">
        {themes.map((t) => t.value === currentTheme && t.component)}
        <span className="w-0 text-p text-transparent select-none">Theme Toggle</span>
      </div>
    </DefaultButton>
  );
}
