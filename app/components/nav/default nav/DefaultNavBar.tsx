import clsx from "clsx";
import { LuBell, LuBellRing } from "react-icons/lu";
import { Link } from "react-router";
import DefaultButton from "~/components/components library/button/DefaultButton";
import ThemeToggle from "~/components/components library/theme toggle/ThemeToggle";
import SetEmailer from "~/components/modal/modals/set up/set notifier email/SetEmailer";
import { useModal } from "~/context/ModalContext";

export default function DefaultNavBar() {
  const { openModal } = useModal();

  return (
    <nav
      className={clsx(
        `absolute top-0 left-0 z-10 flex h-navbar-height w-full flex-row items-center bg-middleground/50 px-md py-3xs text-text shadow-sm shadow-dividers/10 transition-all`,
      )}
    >
      <Link to="/" className="mr-auto flex h-full max-h-full flex-row items-center justify-start gap-sm text-p no-underline">
        Log Forge
      </Link>
      <div className="ml-auto flex h-full max-h-full flex-row items-center justify-end gap-sm text-p">
        <ThemeToggle {...{ customTailwind: "max-h-full h-[80%]! aspect-square!" }} />
        <DefaultButton {...{ onClick: () => openModal(<SetEmailer />, "sm"), customTailwind: "max-h-full h-[80%]!" }}>
          <div className="flex flex-row items-center justify-start gap-3xs text-s text-text">
            <LuBell className="group-hover:hidden" />
            <LuBellRing className="hidden group-hover:block group-hover:animate-bell-ring" />
            Set Notifier Email
          </div>
        </DefaultButton>
      </div>
    </nav>
  );
}
