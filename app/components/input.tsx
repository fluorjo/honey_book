import { UserIcon } from "@heroicons/react/24/solid";
import {
  ForwardedRef,
  InputHTMLAttributes,
  ReactElement,
  forwardRef,
} from "react";
interface InputProps {
  name: string;
  errors?: string[];
  Icon?: ReactElement;
}

const _Input = (
  {
    name,
    Icon,
    errors = [],
    ...rest
  }: InputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col">
      <label className="Input_Form_Label">
        <>{Icon}</>
        <div className="">
          <input
            ref={ref}
            name={name}
            className="grow border-none rounded-md focus:ring-0"
            {...rest}
          />
        </div>
      </label>

      <div className="min-h-[18px]">
        {" "}
        {/* 고정 높이를 주어 레이아웃 변동 방지 */}
        {errors.length > 0 ? (
          errors.map((error, index) => (
            <span
              key={index}
              className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1 pl-10"
            >
              {error}
            </span>
          ))
        ) : (
          <span className="text-transparent text-xs">No error</span> // 에러가 없을 때도 공간 유지
        )}
      </div>
    </div>
  );
};

export default forwardRef(_Input);
