export default function AppHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-200">
        {title}
      </h1>
    </header>
  );
}
