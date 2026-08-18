type AuthSuccessProps = {
  message: string;
};

export default function AuthSuccess({
  message,
}: AuthSuccessProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="success-message">
      {message}
    </p>
  );
}