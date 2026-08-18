type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <div className="glass-card w-full max-w-md p-6">
      <h1 className="text-3xl font-bold text-center mb-2">
        {title}
      </h1>

      {subtitle && (
        <p className="text-center mb-6">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}