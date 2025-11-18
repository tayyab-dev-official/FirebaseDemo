import { useAppContext } from "../hooks/useAppContext";

const filters = ["Today", "Week", "Month", "All"];

function PostFilters() {
  const { postFilter, setPostFilter } = useAppContext();

  const handleFilterClick = (filter: string) => {
    setPostFilter(filter);
  };

  return (
    <section className="flex flex-wrap gap-2">
      {filters.map((filter: string) => {
        const isActive = postFilter === filter;

        return (
          <button
            key={filter}
            id={filter}
            className={`p-2 rounded-lg grow shrink font-bold text-lg ${
              isActive ? "bg-black text-white" : "bg-gray-400"
            }`}
            onClick={() => handleFilterClick(filter)}
          >
            {filter}
          </button>
        );
      })}
    </section>
  );
}

export default PostFilters;
