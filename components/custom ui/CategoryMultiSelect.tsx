"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

interface CategoryMultiSelectProps {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const categories = ["Abaya", "Hijab", "Clothes", "Offers"];

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  placeholder,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 flex-wrap border rounded-md p-2">
        {value.map((category) => (
          <Badge key={category}>
            {category}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(category)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const selectedCategory = categories.find(
                (cat) => cat.toLowerCase() === inputValue.trim().toLowerCase()
              );
              if (selectedCategory && !value.includes(selectedCategory)) {
                onChange(selectedCategory);
                setInputValue("");
              }
            }
          }}
          className="flex-1 outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories
          .filter((category) => !value.includes(category))
          .map((category) => (
            <Badge
              key={category}
              onClick={() => onChange(category)}
              className="cursor-pointer hover:bg-gray-200"
            >
              {category}
            </Badge>
          ))}
      </div>
    </div>
  );
};

export default CategoryMultiSelect;