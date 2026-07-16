"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

/** DESIGN.md Switch — track 48×28, thumb 24; on=primary, off=priority-default */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-7 w-12 shrink-0 items-center rounded-pill border border-transparent transition-all duration-150 outline-none",
        "data-[state=checked]:bg-game-primary data-[state=unchecked]:bg-game-priority-default",
        "focus-visible:ring-2 focus-visible:ring-game-focus-ring dark:focus-visible:ring-game-focus-ring-dark",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-6 rounded-pill bg-game-on-primary shadow-sm ring-0 transition-transform duration-150",
          "data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
