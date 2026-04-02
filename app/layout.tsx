import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gmail 시그니처 생성기",
  description: "Gmail 시그니처를 쉽게 만들어보세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
