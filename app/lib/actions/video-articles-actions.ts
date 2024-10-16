"use server";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { db } from "@vercel/postgres";
import { z } from "zod";

// AWS_S3_BUCKET_NAME

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
  },
});

async function uploadFileToS3(file: Buffer, fileName: string) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };
  const command = new PutObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully:", response);
    return { success: true, fileName };
  } catch (error) {
    return { success: false, fileName: "", error };
  }
}

async function uploadVideoArticleInformation(
  title: string,
  description: string,
  link: string,
  thumbnail_url: string,
  user_id: string
) {
  try {
    const client = await db.connect();
    const insertVideoData =
      await client.sql`insert into video_articles(title, description, link, thumbnail_url, user_id) values (${title}, ${description}, ${link}, ${thumbnail_url}, ${user_id})`;
    if (insertVideoData?.rowCount && insertVideoData.rowCount > 0) {
      return { success: true };
    } else {
      return {
        success: false,
      };
    }
  } catch (error) {
    throw error;
  }
}

export async function uploadVideoArticle(
  prevState: any | undefined,
  formData: FormData
) {
  const session = await auth();
  try {
    const file = formData.get("articleThumbnail");
    if (
      file === null ||
      (file !== null && typeof file === "object" && file.size === 0)
    ) {
      throw new Error("Please select a file");
    }

    const parsedCredentials = z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        link: z.string().min(1),
      })
      .safeParse({
        title: formData.get("articleHeadline"),
        description: formData.get("articleDescription"),
        link: formData.get("articleLink"),
      });

    if (!parsedCredentials.success) {
      throw new Error("Please fill in all the fields");
    }
    const { title, description, link } = parsedCredentials.data;

    const thumbnail_url =
      "https://fun-zone-video-articles.s3.ap-south-1.amazonaws.com/" +
      file.name;

    const userId = session?.user?.id;
    const response = await uploadVideoArticleInformation(
      title,
      description,
      link,
      thumbnail_url,
      userId
    );

    if (response.success) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResponse = await uploadFileToS3(buffer, file.name);
      if (uploadResponse.success) {
      } else {
        const client = await db.connect();
        const deleteVideoData =
          await client.sql`delete from video_articles where thumbnail_url=${thumbnail_url}`;
        if (deleteVideoData?.rowCount && deleteVideoData.rowCount > 0) {
          throw new Error("Atomic Transaction re-rolled!");
        } else {
          throw uploadResponse.error;
        }
      }
    }

    revalidatePath("/");
    return { status: "success", message: "File has been uploaded." };
  } catch (error) {
    // This way of handling error gets rid of error's type unknown problem
    if (error instanceof Error) {
      return {
        status: "error",
        message: error.message,
      };
      // Fallback in case error is not an instance of Error
    } else {
      return {
        status: "error",
        message: "Failed to upload file due to unknown an reason",
      };
    }
  }
}

async function deleteFileFromS3(fileName: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
  };
  console.log("file to be delete", fileName);
  const command = new DeleteObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    console.log("File deleted successfully from S3:", response);
    return { success: true, fileName };
  } catch (error) {
    console.log("Error deleting file from S3:", error);
    return { success: false, fileName: "", error };
  }
}

async function updateVideoArticleInformation(
  title: string,
  description: string,
  link: string,
  videoId: string | undefined,
  thumbnail_url?: string
) {
  try {
    console.log("Check for thumbnail url");
    console.log(videoId);
    console.log(thumbnail_url);
    const client = await db.connect();
    let updateVideoData = null;

    if (thumbnail_url) {
      updateVideoData =
        await client.sql`update video_articles set title = ${title}, description= ${description}, thumbnail_url = ${thumbnail_url}, link=${link} where id = ${videoId}`;
    } else {
      updateVideoData =
        await client.sql`update video_articles set title = ${title}, description= ${description}, link=${link} where id = ${videoId}`;
    }

    if (updateVideoData?.rowCount && updateVideoData.rowCount > 0) {
      return { success: true };
    } else {
      return {
        success: false,
      };
    }
  } catch (error) {
    throw error;
  }
}

export async function updateVideoArticle(
  prevState: string | undefined,
  formData: FormData
) {
  console.log(formData);
  try {
    const videoId = formData.get("videoId")?.toString();
    const file = formData.get("articleThumbnail");
    console.log("here");
    console.log(file.size === 0);
    const parsedCredentials = z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        link: z.string().min(1),
      })
      .safeParse({
        title: formData.get("articleHeadline"),
        description: formData.get("articleDescription"),
        link: formData.get("articleLink"),
      });
    if (!parsedCredentials.success) {
      throw new Error("Please fill in all the fields");
    }

    const { title, description, link } = parsedCredentials.data;
    let oldTitle = formData.get("oldTitle");
    let oldDescription = formData.get("oldDescription");
    let oldArticleLink = formData.get("oldArticleLink");
    const old_thumbnail_url = formData.get("thumbnailUrl");
    const new_thumbnail_url =
      "https://fun-zone-video-articles.s3.ap-south-1.amazonaws.com/" +
      file.name;
    console.log("Thumbnail urls comparison");
    console.log(old_thumbnail_url);
    console.log(new_thumbnail_url);

    // Seperate responses because we have additional success check in case of a new url provided thats why we did not use the same update code even if we could
    // use the old thumbnail url and new thumbnail url in a same thumbnail url variable
    if (file?.size === 0 || old_thumbnail_url == new_thumbnail_url) {
      console.log("First sql call");
      const response = await updateVideoArticleInformation(
        title,
        description,
        link,
        videoId
      );
    } else {
      console.log("second sql call");
      const response = await updateVideoArticleInformation(
        title,
        description,
        link,
        videoId,
        new_thumbnail_url
      );

      if (response.success) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResponse = await uploadFileToS3(buffer, file.name);
        console.log("Upload response load");
        console.log(uploadResponse);
        if (uploadResponse.success) {
          const old_thumbnail_name = old_thumbnail_url.split("/").pop();
          console.log(old_thumbnail_name);
          await deleteFileFromS3(old_thumbnail_name);
        } else {
          const client = await db.connect();
          console.log("Change video data initiated");
          console.log(oldTitle, oldDescription, oldArticleLink);
          const chageVideoData =
            await client.sql`update video_articles set title = ${oldTitle}, description = ${oldDescription}, link = ${oldArticleLink}, thumbnail_url = ${old_thumbnail_url} where id=${videoId}`;
          if (chageVideoData?.rowCount && chageVideoData.rowCount > 0) {
            throw new Error("Atomic Transaction re-rolled!");
          } else {
            console.log("SQL rollback error after the thumbnail error");
            throw updateResponse.error;
          }
        }
      }
    }
    revalidatePath("/");
    return { status: "success", message: "File has been updated." };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: "error",
        message: error.message,
      };
      // Fallback in case error is not an instance of Error
    } else {
      return {
        status: "error",
        message: "Failed to update file due to unknown an reason",
      };
    }
  }
}

export async function fetchVideoArticles() {
  try {
    const client = await db.connect();
    const fetchedVideos = await client.sql`select * from video_articles`;
    if (fetchedVideos?.rowCount && fetchedVideos.rowCount > 0) {
      return { status: "success", fetchedVideos };
    } else {
      throw new Error("Fetch error");
    }
  } catch (error) {
    return { status: "error", error };
  }
}

export async function fetchMyVideoArticles(user_id: string | undefined) {
  try {
    const client = await db.connect();
    const fetchedVideos =
      await client.sql`select * from video_articles where user_id=${user_id}`;
    if (fetchedVideos?.rowCount && fetchedVideos.rowCount > 0) {
      return { status: "success", fetchedVideos };
    } else {
      throw new Error("Fetch error");
    }
  } catch (error) {
    return { status: "error" };
  }
}

export async function getVideoArticle(id: string | null) {
  try {
    const client = await db.connect();
    const fetchedVideo =
      await client.sql`select * from video_articles where id = ${id}`;
    if (fetchedVideo?.rowCount && fetchedVideo.rowCount > 0) {
      const videoData = fetchedVideo.rows[0];
      // console.log("videoData");
      // console.log(videoData);
      return { status: "success", videoData };
    } else {
      throw new Error("Fetch error");
    }
  } catch (error) {
    console.log("Error fetching video article", error);
    return { status: "error" };
  }
}
