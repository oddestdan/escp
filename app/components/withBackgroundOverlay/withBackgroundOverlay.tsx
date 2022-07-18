import type { PropsWithChildren } from "react";
import React from "react";

export interface WithBackgroundOverlayProps {
  imageSrc: string;
  imageAlt: string;
}

const WithBackgroundOverlay: React.FC<
  PropsWithChildren<WithBackgroundOverlayProps>
> = (props) => {
  return (
    <div className="my-4 mx-auto flex sm:w-3/5">
      <div className="relative sm:overflow-hidden">
        <div className="absolute inset-0">
          {/* <img
            className="h-full w-full object-cover"
            src={props.imageSrc}
            alt={props.imageAlt}
          /> */}
          {/* <div className="absolute inset-0 bg-[color:rgba(255,255,255,0.7)]" /> */}
        </div>
        <div className="lg:pb-18 relative">{props.children}</div>
      </div>
    </div>
  );
};

export default WithBackgroundOverlay;

/*
 <div className="my-4 mx-auto sm:px-6 lg:px-8">
      <div className="relative sm:overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src={props.imageSrc}
            alt={props.imageAlt}
          />
          <div className="absolute inset-0 bg-[color:rgba(255,255,255,0.7)]" />
        </div>
        <div className="lg:pb-18 relative px-4 pt-4 pb-4 sm:px-6 lg:px-8">
          {props.children}
        </div>
      </div>
    </div>
    */
