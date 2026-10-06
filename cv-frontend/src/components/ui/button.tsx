import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full font-roboto font-medium uppercase transition-all duration-150 outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#C63031] text-white border border-transparent shadow-xs hover:bg-transparent hover:border-[#C63031] hover:text-[#C63031] active:bg-[#EF9A9A] active:border-transparent active:text-[#C63031] dark:active:text-[#7F1D1D] disabled:bg-[#BDBDBD] dark:disabled:bg-[#555555] disabled:text-white dark:disabled:text-[#A0A0A0] disabled:border-transparent disabled:opacity-100 disabled:shadow-none",
        primary:
          "bg-[#C63031] text-white border border-transparent shadow-xs hover:bg-transparent hover:border-[#C63031] hover:text-[#C63031] active:bg-[#EF9A9A] active:border-transparent active:text-[#C63031] dark:active:text-[#7F1D1D] disabled:bg-[#BDBDBD] dark:disabled:bg-[#555555] disabled:text-white dark:disabled:text-[#A0A0A0] disabled:border-transparent disabled:opacity-100 disabled:shadow-none",
        secondary:
          "bg-transparent border border-[#2E2E2E] dark:border-[#D1D1D6] text-[#2E2E2E] dark:text-[#F5F5F7] hover:bg-[#9E9E9E] hover:border-[#9E9E9E] hover:text-white dark:hover:bg-[#F5F5F7] dark:hover:border-[#F5F5F7] dark:hover:text-[#1E1E1E] active:bg-[#424242] active:border-[#424242] active:text-white shadow-xs dark:active:bg-[#383838] dark:active:border-[#8E8E93] dark:active:text-[#F5F5F7] disabled:bg-[#BDBDBD] dark:disabled:bg-[#555555] disabled:border-transparent disabled:text-white dark:disabled:text-[#A0A0A0] disabled:opacity-100",
        outline:
          "bg-transparent border border-[#2E2E2E] dark:border-[#D1D1D6] text-[#2E2E2E] dark:text-[#F5F5F7] hover:bg-[#9E9E9E] hover:border-[#9E9E9E] hover:text-white dark:hover:bg-[#F5F5F7] dark:hover:border-[#F5F5F7] dark:hover:text-[#1E1E1E] active:bg-[#424242] active:border-[#424242] active:text-white shadow-xs dark:active:bg-[#383838] dark:active:border-[#8E8E93] dark:active:text-[#F5F5F7] disabled:bg-[#BDBDBD] dark:disabled:bg-[#555555] disabled:border-transparent disabled:text-white dark:disabled:text-[#A0A0A0] disabled:opacity-100",
        ghost:
          "bg-transparent border border-transparent text-[#2E2E2E] dark:text-[#F5F5F7] hover:bg-transparent hover:border-[#2E2E2E] dark:hover:border-[#8E8E93] hover:text-[#2E2E2E] dark:hover:text-[#F5F5F7] active:bg-[#BDBDBD] active:border-transparent active:text-[#2E2E2E] dark:active:bg-[#F5F5F7] dark:active:text-[#1E1E1E] disabled:bg-[#BDBDBD] dark:disabled:bg-[#555555] disabled:border-transparent disabled:text-white dark:disabled:text-[#A0A0A0] disabled:opacity-100",
        "primary-v2":
          "bg-transparent border border-transparent text-[#C63031] dark:text-[#C63031] hover:bg-transparent hover:border-[#C63031] hover:text-[#C63031] active:bg-[#EF9A9A] active:border-transparent active:text-[#C63031] dark:active:text-[#7F1D1D] disabled:bg-[#BDBDBD] dark:disabled:bg-[#555555] disabled:border-transparent disabled:text-white dark:disabled:text-[#A0A0A0] disabled:opacity-100",
        icon:
          "bg-transparent border border-transparent text-[#2E2E2E] dark:text-[#F5F5F7] hover:bg-transparent hover:border-[#2E2E2E] dark:hover:border-[#8E8E93] hover:text-[#2E2E2E] dark:hover:text-[#F5F5F7] active:bg-[#9E9E9E] active:border-[#9E9E9E] active:text-white dark:active:bg-[#F5F5F7] dark:active:border-[#F5F5F7] dark:active:text-[#1E1E1E] disabled:bg-transparent disabled:border-transparent disabled:text-[#AEAEAE] dark:disabled:text-[#626262] disabled:opacity-50",
        destructive:
          "bg-[#C63031] text-white border border-transparent shadow-xs hover:bg-transparent hover:border-[#C63031] hover:text-[#C63031] active:bg-[#EF9A9A] active:border-transparent active:text-[#C63031] dark:active:text-[#7F1D1D] disabled:bg-[#BDBDBD] dark:disabled:bg-[#555555] disabled:text-white dark:disabled:text-[#A0A0A0] disabled:border-transparent disabled:opacity-100 disabled:shadow-none",
        link:
          "bg-transparent border-transparent text-[#C63031] underline-offset-4 hover:underline lowercase normal-case tracking-normal",
      },
      size: {
        default: "h-9 px-6 text-xs tracking-wider",
        sm: "h-8 px-4 text-xs tracking-wider",
        lg: "h-10 px-8 text-sm tracking-wide",
        xl: "h-12 px-8 text-sm tracking-wide",
        icon: "h-9 w-9 p-0 aspect-square [&_svg]:size-5",
        "icon-sm": "h-8 w-8 p-0 aspect-square [&_svg]:size-4",
        "icon-lg": "h-10 w-10 p-0 aspect-square [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
