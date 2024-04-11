"use client";
import { useFormState } from "react-dom";
import DarkModeToggleButton from "./components/DarkModeToggleButton";
import { login } from "./loginAction";

export default function Home() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div>

      <div>
        <span>🥕</span>
        <h1>당도</h1>
        <h2>당(신 근처의)도(서관)</h2>
      </div>
      <form action="">
        <button className="btn btn-primary">로그인</button>
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
