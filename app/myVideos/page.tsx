import { fetchMyVideoArticles } from "@/app/lib/actions/video-articles-actions";
import { auth } from "@/auth";
import { Button } from "@/app/ui/button";
import Link from "next/link";

export default async function MyVideos() {
  const session = await auth();
  // console.log("Hello");
  // console.log(session);
  const myVideoArticles = await fetchMyVideoArticles(session?.user?.id);
  const myVideoArticlesData = myVideoArticles?.fetchedVideos?.rows;

  // console.log("Start");
  // console.log(myVideoArticlesData);

  return (
    <>
      <div className="w-full p-16">
        {myVideoArticlesData?.map((videoData, index) => {
          return (
            <div key={index} className="flex flex-column w-6/12 justify-around">
              <p className="w-3/5">{videoData.title}</p>
              <Button>
                <Link
                  href={{
                    pathname: "/editVideo",
                    query: { id: videoData.id },
                  }}
                >
                  Edit
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
