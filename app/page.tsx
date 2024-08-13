import CryptoTicker from "@/app/ui/crypto-ticker";
import { cryptos } from "@/app/lib/placeholder-data";

export default function Home() {
  return (
    <main className="h-full">
      <div className="flex flex-col h-full">
        <div className="h-1/4 bg-stone-800">
          <h1 className="text-7xl text-slate-50 text-center mt-20">FUNZONE</h1>
        </div>
        <div className="flex-1">
          <CryptoTicker data={cryptos} />
        </div>
        <div className="w-full h-0.5 bg-gray-300"></div>
        <div className="h-1/6">
          <div className="flex ml-24 w-1/2 mt-5 justify-evenly">
            <p className="cursor-pointer hover:border-b-2 hover:border-black">
              Privacy Policy
            </p>
            <p className="cursor-pointer">Terms Of Use</p>
            <p className="cursor-pointer">Disclaimer</p>
            <p className="cursor-pointer">Credits</p>
          </div>
          <div className="mt-8 flex justify-end mr-12">
            <p>©2024 FUNZONE</p>
          </div>
        </div>
      </div>
    </main>
  );
}
