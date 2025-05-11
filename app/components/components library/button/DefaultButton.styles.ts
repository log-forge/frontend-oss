export const buttonVariants: Record<string, { [key: string]: string }> = {
  filled: {
    default:
      "bg-foreground/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-foreground/100 active:bg-foreground/100 focus:bg-foreground/100",
    background:
      "bg-background/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-background/100 active:bg-background/100 focus:bg-background/100",
    middleground:
      "bg-middleground/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-middleground/100 active:bg-middleground/100 focus:bg-middleground/100",
    foreground:
      "bg-foreground/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-foreground/100 active:bg-foreground/100 focus:bg-foreground/100",
    primary:
      "bg-primary/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-primary/100 active:bg-primary/100 focus:bg-primary/100",
    secondary:
      "bg-secondary/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-secondary/100 active:bg-secondary/100 focus:bg-secondary/100",
    accent:
      "bg-accent/70 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-accent/90 active:bg-accent/90 focus:bg-accent/90",
    highlight:
      "bg-highlight/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-highlight/100 active:bg-highlight/100 focus:bg-highlight/100",
    success:
      "bg-success/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-success/100 active:bg-success/100 focus:bg-success/100",
    warning:
      "bg-warning/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-warning/100 active:bg-warning/100 focus:bg-warning/100",
    error:
      "bg-error/40 text-error-300 light:text-error-700 transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-error/50 active:bg-error/50 focus:bg-error/50",
  },
  gradient: {
    default:
      "bg-gradient-to-tr from-gray-900 to-gray-800 text-palette-light-text shadow-md shadow-content/10 transition-all hover:shadow-lg hover:shadow-content/20",
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
    default: "text-text bg-transparent transition-all hover:bg-foreground/80 active:bg-foreground/100",
    background: "text-text bg-transparent transition-all hover:bg-background/80 active:bg-background/100",
    middleground: "text-text bg-transparent transition-all hover:bg-middleground/80 active:bg-middleground/100",
    foreground: "text-text bg-transparent transition-all hover:bg-foreground/80 active:bg-foreground/100",
    primary: "text-text bg-transparent transition-all hover:bg-primary/80 active:bg-primary/100",
    secondary: "text-text bg-transparent transition-all hover:bg-secondary/80 active:bg-secondary/100",
    accent: "text-text bg-transparent transition-all hover:bg-accent/80 active:bg-accent/100",
    success: "text-text bg-transparent transition-all hover:bg-success/80 active:bg-success/100",
    warning: "text-text bg-transparent transition-all hover:bg-warning/80 active:bg-warning/100",
    error: "text-text bg-transparent transition-all hover:bg-error/80 active:bg-error/100",
  },
};
