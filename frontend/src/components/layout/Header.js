import { Search, Bell } from 'lucide-react';

export default function Header() {
  const currentTime = new Date().toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <header className="h-[70px] px-6 flex justify-between items-center border-b border-border bg-background">
      <h1 className="text-3xl font-bold">Bienvenido</h1>
      {/* <div className="flex items-center gap-4">
        <button className="bg-transparent border-none text-muted-foreground cursor-pointer">
          <Search size={20} />
        </button>
        <button className="bg-transparent border-none text-muted-foreground cursor-pointer">
          <Bell size={20} />
        </button>
        <div className="text-sm text-muted-foreground">{currentTime}</div>
      </div> */}
    </header>
  );
}
