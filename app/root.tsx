import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import { getTheme, type Theme } from "./utils/cookies/theme.server";
import { ClientHintCheck, getHints } from "./utils/client-hints";
import { csrf } from "./utils/cookies/csrf.server";
import { AuthenticityTokenProvider } from "remix-utils/csrf/react";
import { ThemeProvider } from "./context/ThemeContext";
import { ModalProvider } from "./context/ModalContext";
import { QueryClient, QueryClientProvider, useIsFetching, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getContainerAlerts, getContainers, type IAlert, type IContainer } from "./utils/tanstack/queries/containerQueries";

import type { Route } from "./+types/root";
import "./app.css";
import Modal from "./components/modal/Modal";
import NavWrapper from "./components/nav/NavWrapper";
import { useEffect } from "react";
import { getKeywords } from "./utils/tanstack/queries/keywordQueries";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" },
];

export const meta: Route.MetaFunction = () => {
  return [{ title: "My React Router App" }];
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

export function shouldRevalidate(arg: ShouldRevalidateFunctionArgs) {
  return false;
}

interface RootLoaderData {
  theme: string;
  resolvedTheme: string;
  csrfToken: string;
  containers: Record<string, IContainer>;
  alerts: IAlert[];
  // Client hints
  requestInfo: {
    hints: Record<string, string | undefined>;
  };
  ENV: Record<string, string | undefined>;
}

export async function loader({ request }: Route.LoaderArgs) {
  // Get theme from cookie
  const theme = await getTheme(request);
  // console.log("Theme from cookie:", theme);
  // Get client hints
  const hints = getHints(request);
  // console.log("Client hints:", hints);

  // Resolve the actual theme (system resolves to client hint)
  const resolvedTheme = theme === "system" ? hints.theme || "light" : theme;
  // console.log("Resolved theme:", resolvedTheme);

  let [csrfToken, cookie] = await csrf.commitToken(request, 64);

  let containers: Record<string, IContainer> = {};
  let alerts: IAlert[] = [];
  try {
    console.time("root containers and alerts");
    [containers, alerts] = await Promise.all([getContainers(), getContainerAlerts()]);
    console.timeEnd("root containers and alerts");
  } catch (error) {
    console.error("Error loading containers:", error);
  }

  const headers: HeadersInit = {};
  if (cookie) headers["set-cookie"] = cookie;
  return data(
    {
      theme,
      resolvedTheme,
      csrfToken,
      containers,
      alerts,
      requestInfo: {
        hints,
      },
      ENV: {
        VITE_NODE_ENV: process.env.VITE_NODE_ENV,
        VITE_BACKEND_SERVICE_HOST: process.env.VITE_BACKEND_SERVICE_HOST,
        VITE_BACKEND_SERVICE_PORT: process.env.VITE_BACKEND_SERVICE_PORT,
        VITE_EXPOSED_BACKEND_PORT: process.env.VITE_EXPOSED_BACKEND_PORT,
      },
    },
    { status: 200, headers },
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, csrfToken, ENV } = useRouteLoaderData<Partial<RootLoaderData>>("root")!;

  useEffect(() => {
    console.log("ENV:", ENV);
  }, [ENV]);

  return (
    <html lang="en" data-theme={resolvedTheme}>
      <head>
        <ClientHintCheck />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Inject CSRF token into a meta tag */}
        <meta name="csrf-token" content={csrfToken} />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          {ENV!.VITE_NODE_ENV === "development" ? <ReactQueryDevtools initialIsOpen={false} /> : null}
        </QueryClientProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { theme, csrfToken, containers: initContainers, alerts: initAlerts } = loaderData;

  useQuery<Record<string, IContainer>>({
    queryKey: ["containers"],
    queryFn: async () => await getContainers(),
    initialData: initContainers,
    enabled: useIsFetching({ queryKey: ["containers"] }) === 0,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: false,
  });
  useQuery<IAlert[]>({
    queryKey: ["alerts"],
    queryFn: async () => await getContainerAlerts(),
    initialData: initAlerts,
    enabled: useIsFetching({ queryKey: ["alerts"] }) === 0,
    refetchInterval: 1000 * 60 * 1, // 1 minutes
    refetchOnMount: false,
  });
  useQuery<string[]>({
    queryKey: ["keywords"],
    queryFn: async () => await getKeywords(),
    enabled: useIsFetching({ queryKey: ["keywords"] }) === 0,
    refetchInterval: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
  });

  return (
    <AuthenticityTokenProvider token={csrfToken}>
      <ThemeProvider initialTheme={theme as Theme}>
        <ModalProvider {...{ transitionTime: 500 }}>
          <NavWrapper {...{ enableSidePanel: false, hoverSidePanel: false, sidePanelHidesNav: true, sidePanelHidesNavElems: false }}>
            <Outlet />
          </NavWrapper>
          <Modal {...{ transitionTime: 500, closeStyle: "pill-box" }} />
        </ModalProvider>
      </ThemeProvider>
    </AuthenticityTokenProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
