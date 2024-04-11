import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";
interface InputProps {
  name: string;
  errors?: string[];
}

const _Input = (
  {
    name,
    errors = [],
    ...rest
  }: InputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <>
      <input
        ref={ref}
        name={name}
        className="grow border-none focus:ring-0"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </>
  );
};

export default forwardRef(_Input);
