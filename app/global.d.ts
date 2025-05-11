declare global {
  var __db: MongoClient | undefined;

  interface Window {
    ENV: any;
  }

  type FontSize = "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "s" | "t";
  type Spacing =
    | "4xs"
    | "3xs"
    | "2xs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "4xs-3xs"
    | "3xs-2xs"
    | "2xs-xs"
    | "xs-sm"
    | "sm-md"
    | "md-lg"
    | "lg-xl"
    | "xl-2xl"
    | "2xl-3xl"
    | "3xl-4xl"
    | string;
  type ColorName =
    | "primary"
    | "secondary"
    | "accent"
    | "background"
    | "middleground"
    | "foreground"
    | "text"
    | "alt-text"
    | "muted-text"
    | "success"
    | "warning"
    | "error"
    | "highlight"
    | "interactive"
    | "dividers";
  type ColorShade = "" | "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950";
  type Colors = `${ColorName}${ColorShade extends "" ? "" : `-${ColorShade}`}` | `${ColorName}`;

  interface Request {
    user?: User | null; // Attach the user object to the request
  }
}

export {};
