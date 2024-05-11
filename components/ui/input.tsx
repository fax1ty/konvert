import * as React from "react";
import { useId } from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, children, startAdornment, endAdornment, ...props },
    ref
  ) => {
    const id = useId();

    return (
      <div className="flex items-center gap-2 text-slate-300 peer-placeholder-shown:text-slate-500">
        {startAdornment && (
          <label htmlFor={props.id || id}>{startAdornment}</label>
        )}
        <input
          {...props}
          id={props.id || id}
          type={type}
          className={cn(
            "peer h-10 flex-1 bg-transparent text-sm placeholder:text-slate-500 autofill:bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
        />
        {endAdornment && <label htmlFor={props.id || id}>{endAdornment}</label>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
