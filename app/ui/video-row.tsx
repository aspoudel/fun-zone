"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import playIcon from "@/public/assets/icons/play_icon.png";

export default function videoRow({
  title,
  description,
  link,
  thumbnail_url,
  className,
}) {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <div className={clsx("p-16", className)}>
        <div className="mb-16 ">
          <p className="text-xl">{title}</p>
          <div className="ml-24 mt-8">
            <p className="">{description}</p>
            {/* First display the thumbnail and only when play clicked start playing the video */}
            {isClicked ? (
              <iframe
                className="mt-8 w-[840px] h-[472.5px]"
                src={link}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            ) : (
              <div
                className="mt-8 relative cursor-pointer w-[840px] h-[472.5px] border border-black"
                onClick={() => {
                  setIsClicked(true);
                }}
              >
                <div className="backdrop-blur-lg inset-0 absolute">
                  <Image
                    src={thumbnail_url}
                    alt="Thumbnail"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <Image
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  src={playIcon}
                  alt="Play Icon"
                  width={80}
                  height={80}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
