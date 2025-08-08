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
        "w-[180px] self-center sm:w-[270px] xl:w-[385px] px-4 py-2 rounded-lg bg-[#D9D9D9] hover:bg-[#1F3D58] shadow-lg border border-gray-400",
        className
      )}
    >
      {children}
    </div>
  );
};