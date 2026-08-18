import type { ReactNode } from "react";

type MaxWidth =
  | "max-w-sm"
  | "max-w-md"
  | "max-w-lg"
  | "max-w-xl"
  | "max-w-2xl";

interface AuthCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  maxWidth?: MaxWidth;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  icon,
  footer,
  children,
  maxWidth = "max-w-md",
  className = "",
}: AuthCardProps) {
  const hasHeader = !!(icon || title || subtitle);

  return (
    <div className={`mx-auto w-full ${maxWidth} ${className}`}>
      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-white/20
          bg-white/80
          backdrop-blur-xl
          shadow-2xl
          transition-all
          duration-300
          dark:border-white/10
          dark:bg-slate-900/80
        "
      >
        {hasHeader && (
          <div
            className="
              bg-gradient-to-br
              from-violet-600
              via-purple-600
              to-purple-800
              px-6
              pt-8
              pb-8
              text-center
              text-white
            "
          >
            {icon && (
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-3xl
                  backdrop-blur-sm
                "
              >
                {icon}
              </div>
            )}

            {title && (
              <h1 className="text-2xl font-bold tracking-tight">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-violet-100">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {children}
        </div>

        {footer && (
          <div
            className="
              border-t
              border-gray-100
              bg-gray-50/70
              px-6
              py-4
              text-center
              text-sm
              text-gray-600
              dark:border-slate-700
              dark:bg-slate-800/60
              dark:text-gray-300
            "
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthCard;