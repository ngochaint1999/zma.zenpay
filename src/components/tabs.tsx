import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TabsProps<T> {
  items: T[];
  value: T;
  onChange: (item: T) => void;
  renderLabel: (item: T) => ReactNode;
}

export default function Tabs<T>(props: TabsProps<T>) {
  return (
    <div
      className="grid h-11 bg-[#F2F2F2] mx-4 rounded-full p-1"
      style={{
        gridTemplateColumns: `repeat(${props.items.length}, minmax(0, 1fr))`,
      }}
    >
      {props.items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "h-full flex flex-col px-3 cursor-pointer rounded-full",
            props.value === item && "bg-white font-semibold"
          )}
          onClick={() => void props.onChange(item)}
        >
          <div className="flex-1 flex items-center justify-center">
            <span
              className={"truncate ".concat(
                item === props.value ? "" : "text-[#484848]"
              )}
            >
              {props.renderLabel(item)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
