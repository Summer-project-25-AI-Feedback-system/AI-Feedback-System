import React from "react";

interface BasicInfoCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`rounded-2xl shadow p-4 bg-white border ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      )}
      <div className="text-gray-700 text-sm">{children}</div>
    </div>
  );
};
