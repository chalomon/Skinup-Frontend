import React from 'react';
import {Input} from "@/components/ui/input";
import {Search} from 'lucide-react';

interface SearchProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export const SearchComponent: React.FC<SearchProps> = ({searchTerm, onSearchChange}) => {
    return (
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
            <Input
                type="search"
                placeholder="Buscar en la tabla..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
            />
        </div>
    );
};