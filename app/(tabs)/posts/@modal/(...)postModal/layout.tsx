"use client";

export default function ModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div
      className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0"
      onClick={handleBack}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
