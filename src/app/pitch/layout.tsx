export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a2e] overflow-x-hidden">
      {children}
    </div>
  );
}
