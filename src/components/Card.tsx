import * as React from 'react';
import classnames from 'classnames';

// interface para as props do componente Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={classnames(
        "w-[270px] xl:w-[385px] px-4 py-2 rounded-lg bg-[#D9D9D9] shadow-md border border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
};