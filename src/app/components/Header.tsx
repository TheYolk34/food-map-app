"use client";

import { Button } from '@/components/ui/button'; // Убедитесь, что путь соответствует вашей структуре Shadcn

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Food Map Москвы</h1>
        <nav>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
            Главная
          </Button>
          {/* Можно добавить больше кнопок или ссылок */}
        </nav>
      </div>
    </header>
  );
}