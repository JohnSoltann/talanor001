import React from 'react';
import { FaChartLine, FaCoins, FaGlobe, FaBook, FaGem, FaCrown, FaRing, FaLink } from 'react-icons/fa';

interface BlogIconProps {
  category: string;
  size?: number;
  className?: string;
}

const BlogIcon: React.FC<BlogIconProps> = ({ category, size = 24, className = '' }) => {
  const getIcon = () => {
    switch (category.toLowerCase()) {
      case 'market':
        return <FaChartLine size={size} className={`text-yellow-500 ${className}`} />;
      case 'investment':
        return <FaCoins size={size} className={`text-yellow-500 ${className}`} />;
      case 'global':
        return <FaGlobe size={size} className={`text-yellow-500 ${className}`} />;
      case 'education':
        return <FaBook size={size} className={`text-yellow-500 ${className}`} />;
      case 'jewelry':
        return <FaGem size={size} className={`text-yellow-500 ${className}`} />;
      case 'luxury':
        return <FaCrown size={size} className={`text-yellow-500 ${className}`} />;
      case 'rings':
        return <FaRing size={size} className={`text-yellow-500 ${className}`} />;
      case 'bracelets':
        return <FaLink size={size} className={`text-yellow-500 ${className}`} />;
      default:
        return <FaGem size={size} className={`text-yellow-500 ${className}`} />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getIcon()}
    </div>
  );
};

export default BlogIcon; 