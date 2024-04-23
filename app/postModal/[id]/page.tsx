"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ModalToDetailPage({ params }: any) {
  const id = params.id;
  const router = useRouter();
  useEffect(() => {
    router.push(`/postDetail/${id}`);
  }, [id, router]);
  
  //약간 뭔가 로딩 화면이라도 넣으면 더 좋을지도.
  return <div></div>;
}

export default ModalToDetailPage;
