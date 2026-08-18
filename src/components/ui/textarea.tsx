import React from "react"

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
){
  return (
    <textarea
      {...props}
      className="border rounded-lg p-2 w-full"
    />
  )
}
