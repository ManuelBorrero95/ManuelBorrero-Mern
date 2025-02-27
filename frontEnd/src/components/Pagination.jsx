import React from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  return (
    <div className="flex justify-center gap-4 items-center text-black dark:text-white font-semibold text-2xl absolute left-1/2 transform -translate-x-1/2 -bottom-24 w-full">
      <button
        className="text-black dark:text-white border-2 border-solid border-transparent hover:border-Viola text-2xl font-bold rounded-full p-3 px-4 font-mono transition-all duration-300 ease-in-out"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <MdKeyboardArrowLeft />
      </button>
      <span className="text-black dark:text-white text-2xl font-semibold font-">
        {currentPage}/{totalPages}
      </span>
      <button
        className="text-black dark:text-white border-2 border-solid border-transparent hover:border-Viola text-2xl font-bold rounded-full p-3 px-4 font-mono transition-all duration-300 ease-in-out"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <MdKeyboardArrowRight />
      </button>
    </div>
  );
}
