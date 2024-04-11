'use client'
import DarkModeToggleButton from "./components/DarkModeToggleButton";

export default function Home() {
  return (
    <div>
      <div>
        <span>🥕</span>
        <h1>당근</h1>
        <h2>당근 마켓에 어서오세요!</h2>
      </div>
      <div>
        <button className="btn btn-primary">시작하기</button>
        <div>
          <span>이미 계정이 있나요?</span>
          <button className="btn btn-primary">로그인</button>
          <DarkModeToggleButton />
        </div>
      </div>
    </div>
  );
}
