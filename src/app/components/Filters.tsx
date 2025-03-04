"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { FilterParams } from '@/lib/types';

interface FiltersProps {
  onFilterChange: (filters: FilterParams) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({
    operatingCompany: '',
    typeObject: '',
    isNetObject: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Applying filters:', filters); // Проверяем, что передаётся
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
            placeholder="Наименование"
            value={filters.operatingCompany}
            onChange={(e) => setFilters({ ...filters, operatingCompany: e.target.value })}
          />
          <Input
            placeholder="Тип объекта"
            value={filters.typeObject}
            onChange={(e) => setFilters({ ...filters, typeObject: e.target.value })}
          />
          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.isNetObject || false}
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