type AuthErrorProps = {
  message: string;
};

export default function AuthError({
  message,
}: AuthErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="error-message">
      {message}
    </p>
  );
}