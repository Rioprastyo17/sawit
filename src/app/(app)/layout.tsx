// src/app/(app)/layout.tsx (MODIFIKASI)

// Path diubah untuk menunjuk ke lokasi baru di dalam direktori yang sama
import Header from './component/Header'; 

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}