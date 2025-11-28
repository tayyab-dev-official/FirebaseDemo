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
          if (isActive) {
            OnselectedFolkChange(undefined);
          } else {
            OnselectedFolkChange(id);
          }
        }}
        aria-pressed={isActive}
        className={`w-5/6 max-w-[350px] min-w-[300px] flex flex-col items-center gap-4 p-2 transition-all duration-1000 ease-in-out rounded-lg bg-orange-400 scale-95 ${
          isActive
            ? "scale-100 ring-4 ring-blue-400 opacity-100"
            : "hover:scale-98 hover:opacity-100 opacity-70"
        }`}
      >
        <div className="w-3/4 h-3/4">
          <img
            src={productImage}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <div className="font-bold text-4xl">{name}</div>
          <div className="text-4xl text-gray-600">
            {postText.split(" - ")[1]}
          </div>
          <div className="text-green-600 font-bold text-4xl">
            {postText.split(" - ")[2]}
          </div>
        </div>
      </button>
    );
  });

  return (
    <div id="mood-container" className="w-full flex flex-wrap justify-center gap-2 mx-auto">
      {delfolksEl}
    </div>
  );
}
