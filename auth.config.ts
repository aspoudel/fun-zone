import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnUploadVideoArticlePage =
        nextUrl.pathname === "/uploadVideoArticle";
      const isOnHomepage = nextUrl.pathname === "/";
      const isOnGamesPage = nextUrl.pathname === "/games";
      const isOnFunTime = nextUrl.pathname === "/funtime";
      const isOnMyVideos = nextUrl.pathname === "/myVideos";
      const isOnEditVideo = nextUrl.pathname === "/editVideo";

      if (isOnHomepage || isOnGamesPage || isOnFunTime) {
        return true;
      }
      if (isOnUploadVideoArticlePage || isOnMyVideos || isOnEditVideo) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        const callbackUrl = nextUrl.searchParams.get("callbackUrl");
        if (callbackUrl) {
          return Response.redirect(new URL(callbackUrl, nextUrl));
        } else {
          return Response.redirect(new URL("/", nextUrl));
        }
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
// Remember to protect the routes later
