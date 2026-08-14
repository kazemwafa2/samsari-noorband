'use client';

import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  showToggle?: boolean;
  showStrength?: boolean;
}

export function PasswordInput({
  label = 'رمز عبور',
  error,
  hint,
  showToggle = true,
  showStrength = false,
  id: propId,
  className = '',
  autoComplete = showStrength
    ? 'new-password'
    : 'current-password',
  value,
  ...rest
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = propId ?? generatedId;

  const [visible, setVisible] = useState(false);

  const strength = getStrength(String(value ?? ''));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          minLength={8}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint || showStrength
              ? `${inputId}-hint`
              : undefined
          }
          className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-2 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-300 focus:border-violet-500 focus:ring-violet-100'
          } ${showToggle ? 'pe-11' : ''}`}
          {...rest}
        />

        {showToggle && (
          <button
            type="button"
            tabIndex={0}
            onClick={() => setVisible((v) => !v)}
            aria-label={
              visible
                ? 'پنهان کردن رمز عبور'
                : 'نمایش رمز عبور'
            }
            aria-pressed={visible}
            className="
              absolute inset-y-0 end-0
              flex w-11 items-center justify-center
              text-gray-400 transition
              hover:text-gray-600
              focus:outline-none
              focus-visible:text-gray-800
            "
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}

      {!error && hint && (
        <p
          id={`${inputId}-hint`}
          className="mt-1.5 text-xs text-gray-500"
        >
          {hint}
        </p>
      )}

      {!error && showStrength && value && (
        <div
          id={`${inputId}-hint`}
          className="mt-2"
        >
          <div
            className="flex gap-1"
            aria-hidden="true"
          >
            {[1, 2, 3, 4].map((level) => (
              <span
                key={level}
                className={`h-1 flex-1 rounded-full transition ${
                  level <= strength.level
                    ? strength.color
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {strength.label}
          </p>
        </div>
      )}
    </div>
  );
}

function getStrength(value: string): {
  level: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value))
    score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  if (score <= 1) {
    return {
      level: 1,
      label: 'ضعیف',
      color: 'bg-red-500',
    };
  }

  if (score <= 2) {
    return {
      level: 2,
      label: 'متوسط',
      color: 'bg-amber-500',
    };
  }

  if (score <= 4) {
    return {
      level: 3,
      label: 'خوب',
      color: 'bg-lime-500',
    };
  }

  return {
    level: 4,
    label: 'قوی',
    color: 'bg-emerald-500',
  };
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line
        x1="2"
        y1="2"
        x2="22"
        y2="22"
      />
    </svg>
  );
}