"use client";
import { useFormState } from "react-dom";
import DarkModeToggleButton from "./components/DarkModeToggleButton";
import { login } from "./loginAction";

export default function Home() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className="flex flex-col items-center">
      <DarkModeToggleButton />
      <div>
        <span>아이콘, 로고</span>
        <h2>당도 - 당(신 근처의)도(서관)</h2>
      </div>
      <form action="" className="flex flex-col items-center gap-2 my-4">
        <label className="input input-primary flex items-center gap-2  bg-yellow-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow border-none focus:ring-0"
            placeholder="Username"
          />
        </label>
        <label className="input input-primary flex items-center gap-2 bg-yellow-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow border-none focus:ring-0"
            placeholder="password"
          />
        </label>
        <button className="btn btn-primary ">로그인</button>
      </form>
      <div>
        <div>
          <span>아직 계정이 없으신가요?</span>
          <button className="btn btn-primary">회원가입</button>
        </div>
      </div>
    </div>
  );
}
