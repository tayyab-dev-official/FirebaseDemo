import { delFolks } from "../DelFolksData";

interface DeliveryFolkProps {
  moodState: string | undefined;
  onMoodChange: (moodId: string | undefined) => void;
}

/**
 * DeliveryFolk Component
 * Displays a list of delivery personnel (delFolks) for selection
 * Allows users to toggle selection of a delivery person
 */
export default function DeliveryFolk({
  moodState,
  onMoodChange,
}: DeliveryFolkProps) {
  const delfolksEl = delFolks.map((folk) => {
    const { id, name, imageUrl, moodText } = folk;
    const isActive = moodState === id;

    return (
      <button
        key={id}
        id={id}
        onClick={() => {
          if (isActive) {
            onMoodChange(undefined);
          } else {
            onMoodChange(id);
          }
        }}
        aria-pressed={isActive}
        className={`flex flex-col justify-center items-center gap-2 p-2 transition-all duration-1000 ease-in-out rounded-lg ${
          isActive
            ? "scale-110 ring-4 ring-blue-400 opacity-100"
            : "hover:scale-105 hover:opacity-100 opacity-70"
        }`}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-12 h-12 rounded-full object-cover object-center"
        />
        <div className="text-center">
          <div className="font-bold text-sm">{name}</div>
          <div className="text-xs text-gray-600">
            {moodText.split(" - ")[1]}
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
