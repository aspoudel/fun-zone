import CryptoTicker from "@/app/ui/crypto-ticker";
import { cryptos } from "@/app/lib/placeholder-data";
import Image from "next/image";
import SideMenu from "@/app/ui/side-menu";
import funTime from "@/public/assets/images/fun-time.jpg";
import games from "@/public/assets/images/games.jpg";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="h-full">
      <SideMenu />
      <div className="flex flex-col h-full">
        <div className="h-1/4 bg-stone-800">
          <h1 className="text-7xl text-slate-50 text-center mt-20">FUNZONE</h1>
        </div>
        <div className="flex-1">
          <CryptoTicker data={cryptos} />
          <div className="h-full w-10/12 flex flex-wrap ml-32 mt-5">
            <div className="h-1/3 w-1/5">
              <div className="w-full h-full relative cursor-pointer rounded-lg overflow-hidden">
                <Link href="/funtime">
                  <Image
                    src={funTime}
                    alt="Picture of fun time"
                    layout="fill"
                    objectFit="cover"
                  />
                </Link>
              </div>

              <p>Fun Time</p>
            </div>
            <div className="h-1/3 w-1/5 ml-20">
              <div className="w-full h-full relative cursor-pointer rounded-lg overflow-hidden">
                <Link href="/games">
                  <Image
                    src={games}
                    alt="Picture of games"
                    layout="fill"
                    objectFit="cover"
                  />
                </Link>
              </div>
              <p>Games</p>
            </div>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-300"></div>
        <div className="h-1/6">
          <div className="flex ml-24 w-1/2 mt-5 justify-evenly">
            <p className="cursor-pointer hover:border-b-2 hover:border-black">
              Privacy Policy
            </p>
            <p className="cursor-pointer hover:border-b-2 hover:border-black">
              Terms Of Use
            </p>
            <p className="cursor-pointer hover:border-b-2 hover:border-black">
              Disclaimer
            </p>
            <p className="cursor-pointer hover:border-b-2 hover:border-black">
              Credits
            </p>
          </div>
          <div className="mt-8 flex justify-end mr-12">
            <p>©2024 FUNZONE</p>
          </div>
        </div>
      </div>
    </main>
  );
}
