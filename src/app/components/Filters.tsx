"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Убедитесь, что путь правильный
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterParams } from '@/lib/types';

interface FiltersProps {
  onFilterChange: (filters: FilterParams) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger asChild>
        <Button variant="outline">
          {isOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Название компании"
            onChange={(e) => setFilters({ ...filters, operatingCompany: e.target.value })}
          />
          <Input
            placeholder="Тип объекта"
            onChange={(e) => setFilters({ ...filters, typeObject: e.target.value })}
          />
          <div className="flex items-center space-x-2">
            <Switch
              onCheckedChange={(checked) => setFilters({ ...filters, isNetObject: checked })}
            />
            <span>Сетевое заведение</span>
          </div>
          <Button type="submit">Применить</Button>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}