import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[11rem] sm:auto-rows-[13rem] md:auto-rows-[15rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <a
    href={href}
    className={cn(
      "group relative col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // Clean white background with subtle shadows like the image
      "bg-white",
      "shadow-md hover:shadow-lg",
      "transform-gpu transition-all duration-300 hover:scale-[1.01]",
      // Dark mode support
      "dark:bg-gray-900 dark:shadow-gray-800/50",
      // Cursor and hover effects
      "cursor-pointer hover:shadow-xl",
      className,
    )}
  >
    <div>{background}</div>
    <div className="z-10 flex transform-gpu flex-col gap-1.5 sm:gap-2.5 p-3 sm:p-4 transition-all duration-300">
      <Icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 origin-left transform-gpu text-blue-600 dark:text-blue-400 transition-all duration-300 ease-in-out group-hover:text-blue-700 dark:group-hover:text-blue-300" />
      <h3 className="text-base sm:text-lg font-semibold text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200">
        {name}
      </h3>
      <p className="text-xs sm:text-sm max-w-lg text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">{description}</p>
    </div>
  </a>
);

export { BentoCard, BentoGrid };
