"use client";

import React from "react";

interface SelectProps
extends React.SelectHTMLAttributes<HTMLSelectElement> {
children: React.ReactNode;
}

export function Select({
children,
className="",
...props
}: SelectProps){

return (

<select
className={
`
w-full
rounded-xl
border
bg-white/10
backdrop-blur
px-4
py-3
outline-none
${className}
`
}
{...props}
>

{children}

</select>

);

}
