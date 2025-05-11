export const dropDownVariants: Record<string, { [key: string]: string }> = {
  filled: {
    default: "bg-foreground text-text transition-all shadow-md shadow-dividers/10",
    primary: "bg-primary text-text transition-all shadow-md shadow-dividers/20",
    secondary: "bg-secondary text-text transition-all shadow-md shadow-dividers/20",
    accent: "bg-accent text-text transition-all shadow-md shadow-dividers/20",
  },
  gradient: {
    default: "bg-gradient-to-tr from-foreground to-middleground text-text shadow-lg shadow-dividers/30",
    primary: "bg-gradient-to-tr from-primary to-foreground text-text shadow-lg shadow-dividers/30",
    secondary: "bg-gradient-to-tr from-foreground to-middleground text-text shadow-lg shadow-dividers/30",
    accent: "bg-gradient-to-tr from-foreground to-middleground text-text shadow-lg shadow-dividers/30",
  },
  outline: {
    default: "border border-content text-text transition-all hover:opacity-75 focus:ring focus:ring-content",
    "accent-primary": "bg-accent-primary",
    "accent-secondary": "bg-accent-secondary",
    background: "bg-background",
    content: "bg-content",
    error: "bg-error",
    success: "bg-success",
    "palette-light-background": "bg-palette-light-background",
    "palette-dark-background": "bg-palette-dark-background",
    "palette-light-content": "bg-palette-light-content",
    "palette-dark-content": "bg-palette-dark-content",
  },
  text: {
    default: "text-text transition-all hover:bg-background-highlight/60 active:bg-background-highlight/100",
    "accent-primary": "bg-accent-primary",
    "accent-secondary": "bg-accent-secondary",
    background: "bg-background",
    content: "bg-content",
    error: "bg-error",
    success: "bg-success",
    "palette-light-background": "bg-palette-light-background",
    "palette-dark-background": "bg-palette-dark-background",
    "palette-light-content": "bg-palette-light-content",
    "palette-dark-content": "bg-palette-dark-content",
  },
};

export const dropDownItemVariants: Record<string, { [key: string]: string }> = {
  filled: {
    default: "bg-middleground/0 text-text transition-all hover:bg-middleground/40 active:bg-middleground/40 focus:bg-middleground/40",
    primary: "bg-primary/80 text-text transition-all hover:bg-primary/100 active:bg-primary/100 focus:bg-primary/100",
    secondary: "bg-secondary/80 text-text transition-all hover:bg-secondary/100 active:bg-secondary/100 focus:bg-secondary/100",
    accent: "bg-accent/80 text-text transition-all hover:bg-accent/100 active:bg-accent/100 focus:bg-accent/100",
    error: "bg-error/80 text-text transition-all hover:bg-error/100 active:bg-error/100 focus:bg-error/100",
  },
  gradient: {
    default:
      "bg-gradient-to-tr from-gray-900 to-gray-800 text-palette-light-text shadow-md shadow-content/10 transition-all hover:shadow-lg hover:shadow-content/20",
    primary:
      "bg-primary/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-primary/100 active:bg-primary/100 focus:bg-primary/100",
    secondary:
      "bg-secondary/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-secondary/100 active:bg-secondary/100 focus:bg-secondary/100",
    accent:
      "bg-accent/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-accent/100 active:bg-accent/100 focus:bg-accent/100",
  },
  outline: {
    default: "border border-content text-text transition-all hover:opacity-75 focus:ring focus:ring-content",
    "accent-primary": "bg-accent-primary",
    "accent-secondary": "bg-accent-secondary",
    background: "bg-background",
    content: "bg-content",
    error: "bg-error",
    success: "bg-success",
    "palette-light-background": "bg-palette-light-background",
    "palette-dark-background": "bg-palette-dark-background",
    "palette-light-content": "bg-palette-light-content",
    "palette-dark-content": "bg-palette-dark-content",
  },
  text: {
    default: "text-text bg-transparent transition-all hover:bg-foreground/20 active:bg-foreground/20",
    primary: "text-text bg-transparent transition-all hover:bg-primary/20 active:bg-primary/20",
    secondary: "text-text bg-transparent transition-all hover:bg-secondary/20 active:bg-secondary/20",
    accent: "text-text bg-transparent transition-all hover:bg-accent/20 active:bg-accent/20",
    error: "text-error bg-transparent transition-all hover:bg-error/20 active:bg-error/20",
  },
};
