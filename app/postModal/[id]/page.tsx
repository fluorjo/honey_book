"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ModalToDetailPage({ params }: any) {
  const id = params.id;
  const router = useRouter();
  useEffect(() => {
    router.push(`/postDetail/${id}`);
  }, [id, router]);

  return <div></div>;
}

export default ModalToDetailPage;
