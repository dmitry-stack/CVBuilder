"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export interface DatePickerCalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  className?: string;
}

export function DatePickerCalendar({
  selectedDate,
  onSelect,
  className,
}: DatePickerCalendarProps) {
  const initial = selectedDate || new Date();
  const [currentYear, setCurrentYear] = React.useState(initial.getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(initial.getMonth());
  const [viewMode, setViewMode] = React.useState<"days" | "months" | "years">("days");
  const [yearRangeStart, setYearRangeStart] = React.useState(initial.getFullYear() - 3);

  const handlePrev = () => {
    if (viewMode === "days") {
      if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
      else setCurrentMonth((m) => m - 1);
    } else if (viewMode === "months") {
      setCurrentYear((y) => y - 1);
    } else {
      setYearRangeStart((y) => y - 12);
    }
  };

  const handleNext = () => {
    if (viewMode === "days") {
      if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
      else setCurrentMonth((m) => m + 1);
    } else if (viewMode === "months") {
      setCurrentYear((y) => y + 1);
    } else {
      setYearRangeStart((y) => y + 12);
    }
  };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();

  const days: Array<{ day: number; isCurrent: boolean; date: Date }> = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrev - i, isCurrent: false, date: new Date(currentYear, currentMonth - 1, daysInPrev - i) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, isCurrent: true, date: new Date(currentYear, currentMonth, d) });
  }
  const rem = 42 - days.length;
  for (let d = 1; d <= rem; d++) {
    days.push({ day: d, isCurrent: false, date: new Date(currentYear, currentMonth + 1, d) });
  }

  const isSameDay = (d1: Date, d2: Date | null) =>
    Boolean(d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate());

  return (
    <div className={cn("w-72 sm:w-80 rounded-lg border border-[#E5E5EA] bg-white p-4 shadow-xl dark:border-[#3A3A3C] dark:bg-[#1C1C1E]", className)}>
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2 font-medium text-sm">
          <button
            type="button"
            onClick={() => setViewMode((v) => (v === "months" ? "days" : "months"))}
            className={cn("cursor-pointer hover:opacity-80", viewMode === "months" ? "text-[#C63031] font-semibold" : "text-[#1C1C1E] dark:text-[#F5F5F7]")}
          >
            {MONTHS[currentMonth]}
          </button>
          <button
            type="button"
            onClick={() => setViewMode((v) => (v === "years" ? "days" : "years"))}
            className={cn("cursor-pointer hover:opacity-80", viewMode === "years" ? "text-[#C63031] font-semibold" : "text-[#1C1C1E] dark:text-[#F5F5F7]")}
          >
            {currentYear}
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={handlePrev} aria-label="Previous" className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D1D1D6] text-cv-muted hover:bg-gray-100 dark:border-[#555555] dark:text-[#8E8E93] dark:hover:bg-[#2C2C2E]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={handleNext} aria-label="Next" className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D1D1D6] text-cv-muted hover:bg-gray-100 dark:border-[#555555] dark:text-[#8E8E93] dark:hover:bg-[#2C2C2E]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === "days" && (
        <div>
          <div className="grid grid-cols-7 pb-1 text-center text-xs font-medium text-[#8E8E93]">
            {WEEKDAYS.map((w, idx) => <span key={idx}>{w}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs sm:text-sm">
            {days.map(({ day, isCurrent, date }, idx) => {
              const selected = isSameDay(date, selectedDate);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelect(date)}
                  className={cn(
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full font-roboto transition-colors",
                    selected ? "bg-[#C63031]! text-white! font-medium" : isCurrent ? "text-[#1C1C1E] hover:bg-gray-100 dark:text-[#F5F5F7] dark:hover:bg-[#2C2C2E]" : "text-[#C4C4C6] dark:text-[#636366]",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === "months" && (
        <div className="grid grid-cols-3 gap-2 py-2">
          {MONTHS.map((name, index) => {
            const isSel = selectedDate && selectedDate.getFullYear() === currentYear && selectedDate.getMonth() === index;
            return (
              <button
                key={name}
                type="button"
                onClick={() => { setCurrentMonth(index); setViewMode("days"); }}
                className={cn("rounded-full px-2 py-1.5 text-xs sm:text-sm font-roboto transition-colors", isSel ? "bg-[#C63031] text-white font-medium" : "text-[#1C1C1E] hover:bg-gray-100 dark:text-[#F5F5F7] dark:hover:bg-[#2C2C2E]")}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {viewMode === "years" && (
        <div className="grid grid-cols-3 gap-2 py-2">
          {Array.from({ length: 12 }, (_, i) => yearRangeStart + i).map((yr) => {
            const isSel = selectedDate && selectedDate.getFullYear() === yr;
            return (
              <button
                key={yr}
                type="button"
                onClick={() => { setCurrentYear(yr); setViewMode("days"); }}
                className={cn("rounded-full px-2 py-1.5 text-xs sm:text-sm font-roboto transition-colors", isSel ? "bg-[#C63031] text-white font-medium" : "text-[#1C1C1E] hover:bg-gray-100 dark:text-[#F5F5F7] dark:hover:bg-[#2C2C2E]")}
              >
                {yr}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
