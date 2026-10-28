"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentProps } from "react";

export function Switch({
  className = "",
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root className={`encore-switch ${className}`} {...props}>
      <SwitchPrimitive.Thumb className="encore-switch-thumb" />
    </SwitchPrimitive.Root>
  );
}
