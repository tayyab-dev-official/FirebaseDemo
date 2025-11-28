import { delFolks } from "../data/DelFolksData";
import chickenCurryCutImg from "../assets/Chicken-Curry-Cut.png"
import chickenBonelessCutImg from "../assets/boneless-chicken.jpg"
import chickenKeemaCutImg from "../assets/chicken-keema.png"
interface DeliveryFolkProps {
  selectedFolk: string | undefined;
  OnselectedFolkChange: (moodId: string | undefined) => void;
}

export default function DeliveryFolk({
  selectedFolk,
  OnselectedFolkChange,
}: DeliveryFolkProps) {
  const delfolksEl = delFolks.map((folk) => {
    const { id, name, postText } = folk;
    const isActive = selectedFolk === id;
    let productImage = undefined
    if (name.toLocaleLowerCase().includes("boneless")){
      productImage = chickenBonelessCutImg
    }
    else if(name.toLocaleLowerCase().includes("keema")) {
      productImage = chickenKeemaCutImg
    }
    else {
      productImage = chickenCurryCutImg
    }
    return (
      <button
        key={id}
        id={id}
        onClick={() => {
          if (isActive) {OnselectedFolkChange(undefined)} 
          else { OnselectedFolkChange(id)}
        }}
        aria-pressed={isActive}
        className={`flex flex-col justify-center items-center gap-2 p-2 transition-all duration-1000 ease-in-out rounded-lg ${
          isActive
            ? "scale-110 ring-4 ring-blue-400 opacity-100"
            : "hover:scale-105 hover:opacity-100 opacity-70"
        }`}
      >
        <img
          src={productImage}
          alt={name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="">
          <div className="font-bold text-sm">{name}</div>
          <div className="text-xs text-gray-600">
            {postText.split(" - ")[1]}
          </div>
          <div className="text-green-600 font-bold">
            {postText.split(" - ")[2]}
          </div>
        </div>
      </button>
    );
  });

  return (
    <div id="mood-container" className="flex flex-wrap gap-2 justify-center">
      {delfolksEl}
    </div>
  );
}
