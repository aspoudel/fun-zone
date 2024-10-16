import entertainment_icon from "@/public/assets/icons/entertainment_icon.png";
import games_icon from "@/public/assets/icons/games_icon.png";
import Image from "next/image";

export default function SideMenu() {
  return (
    <>
      <div className="absolute h-screen  z-10">
        {/* Trapezoid-shaped side menu */}
        <div className="trapezoid-path absolute top-0 left-0 h-1/2 mt-72 w-32 lg:w-20 bg-sky-200 flex flex-col justify-center items-center">
          {/* Fun and Games menu options */}
          <div className="mb-8">
            <div className="text-center">
              {/* Replace this with the actual icon for Fun */}
              <div className="flex justify-center">
                <Image
                  className="h-10 w-10 mb-2 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125"
                  src={entertainment_icon}
                  alt="Fun option icon"
                ></Image>
              </div>
            </div>
          </div>
          <div>
            <div className="text-center">
              {/* Replace this with the actual icon for Games */}
              <div className="flex justify-center">
                <Image
                  className="h-14 w-16 mb-2 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125"
                  src={games_icon}
                  alt="Games option icon"
                ></Image>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
