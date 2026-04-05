export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <link rel="preload" href="/Video.mp4" as="video" type="video/mp4" />
      {children}
    </div>
  );
}
