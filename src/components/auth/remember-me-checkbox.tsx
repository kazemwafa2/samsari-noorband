"use client";

type RememberMeCheckboxProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

export default function RememberMeCheckbox({
  checked,
  onChange,
}: RememberMeCheckboxProps) {
  return (
    <label className="remember-me-box">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
      />

      <span>مرا به خاطر بسپار</span>
    </label>
  );
}