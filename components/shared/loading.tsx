interface LoadingProps {
  text?: string;
}

export function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
        aria-hidden="true"
      />

      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
