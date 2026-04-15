export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/25 selection:text-primary-foreground">
      {children}
    </div>
  );
}
