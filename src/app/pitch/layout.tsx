export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {children}
    </div>
  );
}
