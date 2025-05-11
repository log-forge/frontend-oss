import React from "react";
import clsx from "clsx";
import DefaultNavBar from "./default nav/DefaultNavBar";

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className={`grid h-screen max-h-screen w-screen max-w-screen grid-cols-[1fr] bg-background`}>
      {/* Navbar */}
      <DefaultNavBar />
      {/* Content view */}
      <section
        className={clsx(
          `mt-(--spacing-navbar-height) flex h-full max-h-[calc(100vh-var(--spacing-navbar-height))] w-full flex-row items-start justify-center [overflow:overlay]`,
        )}
      >
        {children}
      </section>
    </div>
  );
}
