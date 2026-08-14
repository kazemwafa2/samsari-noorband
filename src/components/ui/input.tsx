import React from "react"

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="border rounded-lg p-2 w-full"
    />
  )
}
