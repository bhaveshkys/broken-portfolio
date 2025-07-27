"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  // Reduce the number of rows and columns but increase the size to maintain visual density
  const rows = new Array(75).fill(1); // Half the rows
  const cols = new Array(50).fill(1); // Half the columns
  
  // Pre-compute random colors to avoid recalculation
  const colors = useMemo(() => [
    "#93c5fd",
    "#f9a8d4",
    "#86efac",
    "#fde047",
    "#fca5a5",
    "#d8b4fe",
    "#93c5fd",
    "#a5b4fc",
    "#c4b5fd",
  ], []);
  
  // Pre-compute random colors for each cell to avoid recalculation during hover
  const colorMap = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < cols.length; j++) {
        map.set(`${i}-${j}`, colors[Math.floor(Math.random() * colors.length)]);
      }
    }
    return map;
  }, [rows.length, cols.length, colors]);

  const getColor = (i: number, j: number) => {
    return colorMap.get(`${i}-${j}`);
  };

  // Use CSS transform instead of motion.div for non-interactive elements
  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4 cursor-default",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="relative h-16 w-32 border-l border-slate-200" // Double the size
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getColor(i, j),
                transition: { duration: 0 },
              }}
              // Remove unnecessary animate prop
              key={`col` + j}
              className="relative h-16 w-32 border-t border-r border-slate-200 cursor-default" // Double the size
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export const Boxes = React.memo(BoxesCore);
