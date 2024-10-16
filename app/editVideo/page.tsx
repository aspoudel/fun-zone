"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/ui/button";
import { updateVideoArticle } from "@/app/lib/actions/video-articles-actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { getVideoArticle } from "@/app/lib/actions/video-articles-actions";

const initialState = { message: "", status: "" };

export default function EditVideo() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [articleLink, setArticleLink] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [oldTitle, setOldTitle] = useState("");
  const [oldDescription, setOldDescription] = useState("");
  const [oldArticleLink, setOldArticleLink] = useState("");
  const [id, setId] = useState(idParam);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [state, formAction] = useActionState(updateVideoArticle, initialState);

  useEffect(() => {
    const fetchVideosArticle = async () => {
      try {
        const response = await getVideoArticle(idParam);
        console.log("and now");
        console.log(response.videoData);
        setTitle(response.videoData?.title);
        setOldTitle(response.videoData?.title);
        setDescription(response.videoData?.description);
        setOldDescription(response.videoData?.description);
        setArticleLink(response.videoData?.link);
        setOldArticleLink(response.videoData?.link);
        setThumbnailUrl(response.videoData?.thumbnail_url);
        console.log(thumbnailUrl);
      } catch (error) {
        console.error("Failed to fetch video article:", error);
      }
    };
    fetchVideosArticle();
  }, []);

  useEffect(() => {
    if (state?.status === "success") {
      setOldTitle(title);
      setOldDescription(description);
      setOldArticleLink(articleLink);
    }
  }, [state?.status]);

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
      <h1 className="ml-20 mt-16 text-5xl mb-4">Update your video article</h1>
      <div className=" flex justify-center">
        <hr className="border-t-2 border-gray-500 w-11/12"></hr>
      </div>
      <div className="ml-32  text-xl">
        <form action={formAction}>
          <input value={oldTitle} name="oldTitle" className="collapse" />
          <input
            value={oldDescription}
            name="oldDescription"
            className="collapse"
          />
          <input
            value={oldArticleLink}
            name="oldArticleLink"
            className="collapse"
          />
          <input value={id} name="videoId" className="collapse" />
          <input
            value={thumbnailUrl}
            name="thumbnailUrl"
            className="collapse"
          ></input>
          <div className="mt-8">
            <p>Edit Article Headline:</p>
            <input
              onChange={(e) => setTitle((title) => e.target.value)}
              value={title}
              className="w-96 mt-2 border-2 border-gray-500"
              placeholder="Type video headline"
              name="articleHeadline"
            />
          </div>
          <div className="mt-8">
            <p>Edit Article description:</p>
            <textarea
              onChange={(e) => setDescription((description) => e.target.value)}
              value={description}
              name="articleDescription"
              className="w-96 mt-2 border-2 border-gray-500"
              placeholder="Type video description"
            />
          </div>
          <div className="mt-8">
            <p>Edit Article thumbnail:</p>
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
                ) : thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt="Existing Thumbnail"
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
            <p>Edit Article link(No copyright infringement allowed):</p>
            <input
              value={articleLink}
              onChange={(e) => setArticleLink((articleLink) => e.target.value)}
              className="w-96 mt-2 border-2 border-gray-500"
              placeholder="Type in the URL/Link"
              name="articleLink"
            ></input>
          </div>
          <div className="mt-8 flex flex-column w-64 justify-between">
            <Button type="submit">Update Post</Button>
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
