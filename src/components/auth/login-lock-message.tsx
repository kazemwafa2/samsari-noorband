type LoginLockMessageProps = {
  remainingTime: number;
};

export default function LoginLockMessage({
  remainingTime,
}: LoginLockMessageProps) {
  if (remainingTime <= 0) {
    return null;
  }

  return (
    <p className="error-message">
      لطفاً {remainingTime} ثانیه دیگر
      دوباره تلاش کنید.
    </p>
  );
}