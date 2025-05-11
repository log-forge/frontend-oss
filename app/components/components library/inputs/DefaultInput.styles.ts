export const inputVariants: Record<string, { [key: string]: string }> = {
  filled: {
    default:
      "bg-foreground/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-foreground/100 active:bg-foreground/100 focus:bg-foreground/100 placeholder:!text-muted-text",
    background:
      "bg-background/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-background/100 active:bg-background/100 focus:bg-background/100 placeholder:!text-muted-text",
    middleground:
      "bg-middleground/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-middleground/100 active:bg-middleground/100 focus:bg-middleground/100 placeholder:!text-muted-text",
    foreground:
      "bg-foreground/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-foreground/100 active:bg-foreground/100 focus:bg-foreground/100 placeholder:!text-muted-text",
    primary:
      "bg-primary/50 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-primary/70 active:bg-primary/70 focus:bg-primary/70 placeholder:!text-alt-text",
    secondary:
      "bg-secondary/50 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-secondary/70 active:bg-secondary/70 focus:bg-secondary/70 placeholder:!text-alt-text",
    accent:
      "bg-accent/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-accent/100 active:bg-accent/100 focus:bg-accent/100 placeholder:!text-muted-text",
    highlight:
      "bg-highlight/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-highlight/100 active:bg-highlight/100 focus:bg-highlight/100 placeholder:!text-muted-text",
    success:
      "bg-success/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-success/100 active:bg-success/100 focus:bg-success/100 placeholder:!text-muted-text",
    warning:
      "bg-warning/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-warning/100 active:bg-warning/100 focus:bg-warning/100 placeholder:!text-muted-text",
    error:
      "bg-error/80 text-text transition-all hover:shadow-md hover:shadow-dividers/10 hover:bg-error/100 active:bg-error/100 focus:bg-error/100 placeholder:!text-muted-text",
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
    default:
      "border border-content/60 bg-transparent text-text transition-all shadow-sm shadow-content/10 hover:border-content hover:shadow-content/20 focus:border-content focus:shadow focus:shadow-content/20 outline-none !placeholder:text-slate-400",
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
