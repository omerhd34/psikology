import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 active:scale-95",
 {
  variants: {
   variant: {
    default: "bg-slate-900 text-white shadow-lg shadow-slate-900/25 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/30",
    destructive: "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/30",
    outline: "border-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md text-slate-900",
    secondary: "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 hover:shadow-md",
    ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
    link: "text-slate-900 underline-offset-4 hover:underline hover:text-slate-700",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl hover:shadow-blue-500/30",
    success: "bg-green-500 text-white shadow-lg shadow-green-500/25 hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/30",
   },
   size: {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 rounded-lg px-8 text-base",
    icon: "h-10 w-10",
   },
  },
  defaultVariants: {
   variant: "default",
   size: "default",
  },
 }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
 const Comp = asChild ? Slot : "button"
 return (
  <Comp
   className={cn(buttonVariants({ variant, size, className }))}
   ref={ref}
   {...props}
  />
 )
})
Button.displayName = "Button"

export { Button, buttonVariants }