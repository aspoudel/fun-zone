import { fetchVideoArticles } from "@/app/lib/actions/video-articles-actions";
import VideoRow from "@/app/ui/video-row";
import clsx from "clsx";

export default async function FunTime() {
  const videoArticles = await fetchVideoArticles();
  const videoArticlesData = videoArticles.fetchedVideos.rows;

  return (
    <>
      <div className="h-1/4 bg-stone-800 pt-20">
        <h1 className="text-7xl text-slate-50 text-center">FUNZONE</h1>
      </div>
      <div className="">
        {videoArticlesData.map((videoData, index) => (
          <VideoRow
            className={clsx(index % 2 === 1 ? "bg-gray-300 p-16" : "")}
            title={videoData.title}
            description={videoData.description}
            link={videoData.link}
            thumbnail_url={videoData.thumbnail_url}
          />
        ))}
      </div>
    </>
  );
}
