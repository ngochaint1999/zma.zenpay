import { forwardRef, HTMLProps } from "react";

import { ChevronLeftIcon, SearchIcon } from "@/components/vectors";

interface SearchBarProps extends HTMLProps<HTMLInputElement> {
  isBack?: boolean;
  onBack?: () => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (props, ref) => (
    <div className="p-4 pt-0">
      <div className="relative w-full">
        <input
          ref={ref}
          className="w-full h-12 pl-12 pr-3 bg-section text-lg rounded-full outline-none placeholder:text-inactive"
          placeholder="Tìm kiếm"
          {...props}
        />
        {props?.isBack ? (
          <ChevronLeftIcon onClick={() => props?.onBack ? void props?.onBack() : undefined} className="absolute top-3.5 left-3" />
        ) : (
          <SearchIcon className="absolute top-2.5 left-3" />
        )}
      </div>
    </div>
  )
);

export default SearchBar;
