import React, { ReactNode } from "react";

const TransparentCard = (props: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center size-full bg-[rgb(0,0,0,0.4)] rounded-lg p-8 shadow-lg backdrop-blur-sm">
      {props.children}
    </div>
  );
};

export default TransparentCard;
