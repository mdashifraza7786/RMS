"use client";
import React from "react";

type AccentColor = "primary" | "accent" | "success" | "warning" | "danger";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  accent?: AccentColor;
  action?: React.ReactNode;
}

const accentMap: Record<AccentColor, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  accent = "primary",
  action,
}) => {
  return (
    <div className="flex items-start justify-between pt-6 pb-4">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2.5">
          <span className={`w-1 h-7 ${accentMap[accent]} rounded-full flex-shrink-0`} />
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1 ml-[14px]">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
};

export default PageHeader;
