import React, { useState } from 'react';
import CategoryItem from '@/components/CategoryItem';
import z from 'zod';

const CategorySchema = z.enum([
  "Hotels & Accommodations",
  "Restaurants",
  "Bars & Nightlife",
  "Shoppings",
  "Arts",
  "Cafes"
]);

interface FilterProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  className?: string;
}

const categorieList = [
  { value: "Hotels & Accommodations", label: "Hôtels & hébergements" },
  { value: "Restaurants", label: "Restaurants" },
  { value: "Bars & Nightlife", label: "Bars & Clubs" },
  { value: "Shoppings", label: "Shopping" },
  { value: "Arts", label: "Arts & Culture" },
  { value: "Cafes", label: "Cafés" },
];

const Filter: React.FC<FilterProps> = ({ 
  selectedCategories,
  onCategoriesChange, 
}) => {
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const handleToggleCategory = (value: string) => {
    const validation = CategorySchema.safeParse(value);
    
    if (validation.success) {
      let newCategories: string[];
      
      if (selectedCategories.includes(value)) {
        newCategories = selectedCategories.filter((cat) => cat !== value);
      } else {
        newCategories = [...selectedCategories, value];
      }
      
      onCategoriesChange(newCategories);
      setCategoryError(null); 
    } else {
      const errorMessage = validation.error.issues.map(issue => issue.message).join(', ');
      setCategoryError(errorMessage);
    }
  };

  const handleClearCategories = () => {
    onCategoriesChange([]);
    setCategoryError(null);
  };

  return (

    <div>
      <div className="flex flex-row flex-wrap gap-3 py-6">
        <CategoryItem 
          label="Tous les lieux" 
          selected={!selectedCategories.length}
          onClick={handleClearCategories}
        /> 
        {categorieList.map(({ label, value }) => (
          <CategoryItem 
              key={value} 
              label={label} 
              selected={selectedCategories.includes(value)}
              onClick={() => handleToggleCategory(value)}
          /> 
        ))}
      </div>
      
      {categoryError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
              <span className="text-sm text-red-800">{categoryError}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter; 