import React from "react";
import { Search } from "lucide-react";

export function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-2xl">
        <input
          type="search"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-green-600 focus:ring-green-500 focus:border-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
      </div>
    </div>
  );
}