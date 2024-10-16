"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/ui/button";
import { url } from "inspector";
import { uploadVideoArticle } from "@/app/lib/actions/video-articles-actions";
import { useActionState } from "react";

const initialState = { message: "", status: "" };

export default function uploadArticle() {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [state, formAction] = useActionState(uploadVideoArticle, initialState);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleDiscard = () => {
    setThumbnail(null);
  };

  return (
    <div>
      <h1 className="ml-20 mt-16 text-5xl mb-4">
        Upload an Embedded Video Link
      </h1>
      <div className=" flex justify-center">
        <hr className="border-t-2 border-gray-500 w-11/12"></hr>
      </div>
      <div className="ml-32  text-xl">
        <form action={formAction}>
          <div className="mt-8">
            <p>Article Headline:</p>
            <input
              className="w-96 mt-2 border-2 border-gray-500"
              placeholder="Type video headline"
              name="articleHeadline"
            />
          </div>
          <div className="mt-8">
            <p>Write a short description about the article:</p>
            <textarea
              name="articleDescription"
              className="w-96 mt-2 border-2 border-gray-500"
              placeholder="Type video description"
            />
          </div>
          <div className="mt-8">
            <p>Article thumbnail:</p>
            <div>
              <label
                htmlFor="thumbnail"
                className="flex flex-col justify-center items-center w-32 h-32 border-2 border-gray-300 border-dashed rounded cursor-pointer hover:border-gray-400 focus:outline-none"
              >
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-3xl text-gray-400">+</span>
                )}
                <input
                  className="hidden"
                  id="thumbnail"
                  type="file"
                  name="articleThumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </label>
            </div>
          </div>
          <div className="mt-8">
            <p>Article link(No copyright infringement allowed):</p>
            <input
              className="w-96 mt-2 border-2 border-gray-500"
              placeholder="Type in the URL/Link"
              name="articleLink"
            ></input>
          </div>
          <div className="mt-8 flex flex-column w-64 justify-between">
            <Button type="submit">Create Post</Button>
            <Button
              type="reset"
              className="bg-red-500 hover:bg-gray-400"
              onClick={handleDiscard}
            >
              Discard
            </Button>
          </div>
        </form>
        {state?.status && (
          <div className={`state-message ${state?.status}`}>
            {state?.message}
          </div>
        )}
      </div>
    </div>
  );
}
