"use client";

import { revalidateTest } from "./action";

interface props {
  postId: number;
}

export default function TestButton({ postId }: props) {
  const onClick = async () => {
    revalidateTest(postId);
  };
  return <button onClick={onClick}>wwww</button>;
}
