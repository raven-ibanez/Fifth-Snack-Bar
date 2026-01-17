import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 overflow-x-auto py-3 scrollbar-hide">
          {loading ? (
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 font-outfit uppercase tracking-tighter ${selectedCategory === 'all'
                    ? 'bg-snack-blue text-white border-snack-blue shadow-md shadow-snack-blue/20 scale-105'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-snack-blue hover:text-snack-blue'
                  }`}
              >
                All Items
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 flex items-center space-x-2 font-outfit uppercase tracking-tighter ${selectedCategory === c.id
                      ? 'bg-snack-blue text-white border-snack-blue shadow-md shadow-snack-blue/20 scale-105'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-snack-blue hover:text-snack-blue'
                    }`}
                >
                  <span className="text-lg">{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;


