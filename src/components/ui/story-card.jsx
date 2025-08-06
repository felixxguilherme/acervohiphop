"use client";

import { motion } from 'motion/react';
import Link from 'next/link';

const StoryCard = ({ 
  title, 
  date, 
  description, 
  image, 
  tags = [], 
  href,
  index = 0,
  className = ""
}) => {
  const CardContent = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`border-3 border-theme rounded-lg overflow-hidden cursor-pointer shadow-lg ${className}`}
    >
      <img 
        src={image} 
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        {date && (
          <div className="text-sm font-sometype-mono text-theme-muted mb-2">{date}</div>
        )}
        <h4 className="font-dirty-stains text-xl mb-3 text-theme-primary leading-tight">{title}</h4>
        <p className="font-sometype-mono text-sm text-theme-secondary mb-4 leading-relaxed">{description}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="bg-[#fae523] text-black px-2 py-1 rounded text-xs font-sometype-mono border border-theme">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default StoryCard;