import { useState } from "react";

const filters = ["Today", "Week", "Month", "All"];

type PostFiltersType = {
  updateFilter: (val: string) => void
}

function PostFilters({ updateFilter }: PostFiltersType) {
  const [filterState, setFilterState] = useState<undefined | string>(undefined);
  return (
    <section className="flex flex-wrap gap-2">
      {filters.map((filter: string) => {
        const isActive = filterState === filter;

        return (
          <button
            key={filter}
            id={filter}
            className={`p-2 rounded-lg grow shrink font-bold text-lg ${
              isActive ? "bg-black text-white" : "bg-gray-400"
            }`}
            onClick={() => {
              setFilterState(filter);
              updateFilter(filter);
            }}
          >
            {filter}
          </button>
        );
      })}
    </section>
  );
}

export default PostFilters;
