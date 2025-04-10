import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath }) => {
  return (
    <div className="flex justify-center items-center my-8 gap-4">
      {currentPage > 1 && (
        <Link
          href={`${basePath}${currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`}`}
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
        >
          قبلی
        </Link>
      )}

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => 
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, index, array) => {
            // Add an ellipsis if there's a gap
            if (index > 0 && array[index - 1] !== page - 1) {
              return (
                <React.Fragment key={`${page}-ellipsis`}>
                  <span className="py-2 px-4 text-gray-500">...</span>
                  <PaginationItem
                    page={page}
                    currentPage={currentPage}
                    basePath={basePath}
                  />
                </React.Fragment>
              );
            }
            return (
              <PaginationItem
                key={page}
                page={page}
                currentPage={currentPage}
                basePath={basePath}
              />
            );
          })}
      </div>

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
        >
          بعدی
        </Link>
      )}
    </div>
  );
};

interface PaginationItemProps {
  page: number;
  currentPage: number;
  basePath: string;
}

const PaginationItem: React.FC<PaginationItemProps> = ({ page, currentPage, basePath }) => {
  const isActive = page === currentPage;
  
  return (
    <Link
      href={`${basePath}${page === 1 ? '' : `?page=${page}`}`}
      className={`py-2 px-4 rounded-md ${
        isActive
          ? 'bg-yellow-500 text-black font-medium'
          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
      } transition-colors`}
    >
      {page}
    </Link>
  );
};

export default Pagination; 