"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const dummyData = [
  { id: 1, title: "Document Review", value: 150, date: new Date("2025-08-15") },
  {
    id: 2,
    title: "Profile Verification",
    value: 89,
    date: new Date("2025-08-18"),
  },
  { id: 3, title: "System Update", value: 234, date: new Date("2025-08-22") },
  {
    id: 4,
    title: "User Registration",
    value: 67,
    date: new Date("2025-08-25"),
  },
  { id: 5, title: "Data Processing", value: 178, date: new Date("2025-08-28") },
  { id: 6, title: "Security Audit", value: 92, date: new Date("2025-09-02") },
  {
    id: 7,
    title: "Performance Check",
    value: 145,
    date: new Date("2025-09-05"),
  },
  { id: 8, title: "Backup Process", value: 203, date: new Date("2025-09-08") },
];

export default function DashboardPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const filteredData = useMemo(() => {
    if (!startDate && !endDate) return dummyData;

    return dummyData.filter((item) => {
      const itemDate = item.date;
      const afterStart = !startDate || itemDate >= startDate;
      const beforeEnd = !endDate || itemDate <= endDate;
      return afterStart && beforeEnd;
    });
  }, [startDate, endDate]);

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Start Date Picker */}
          <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MMM dd") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setIsStartOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* End Date Picker */}
          <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MMM dd") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setIsEndOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters Button */}
          {(startDate || endDate) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Total Documents
          </h3>
          <p className="text-3xl font-bold text-primary">{dummyData.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Verified Profiles
          </h3>
          <p className="text-3xl font-bold text-primary">5</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Pending Reviews
          </h3>
          <p className="text-3xl font-bold text-primary">3</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Activity
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredData.length} of {dummyData.length} items
          </span>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Value
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <td className="p-4 text-card-foreground">{item.title}</td>
                      <td className="p-4 text-card-foreground font-medium">
                        {item.value}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {format(item.date, "MMM dd, yyyy")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No data found for the selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
