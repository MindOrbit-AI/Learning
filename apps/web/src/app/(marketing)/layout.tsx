export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen selection:bg-primary/30 selection:text-primary-foreground">
      {children}
    </div>
  );
}
