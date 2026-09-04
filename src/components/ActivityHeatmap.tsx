import React, { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays } from 'date-fns';

interface HeatmapProps {
  data: { date: string; count: number }[];
}

export function ActivityHeatmap({ data }: HeatmapProps) {
  const weeks = 26; // 6 months roughly
  const days = weeks * 7;
  
  const heatmapData = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(subDays(today, days - 1), { weekStartsOn: 0 }); // start on Sunday
    
    // Create a map for fast lookup
    const countsMap = data.reduce((acc, curr) => {
      acc[curr.date] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    const grid = [];
    for (let i = 0; i < days; i++) {
      const currentDate = addDays(startDate, i);
      const dateString = format(currentDate, 'yyyy-MM-dd');
      grid.push({
        date: currentDate,
        dateString,
        count: countsMap[dateString] || 0
      });
    }
    return grid;
  }, [data]);

  // Max count to scale colors properly
  const maxCount = Math.max(...heatmapData.map(d => d.count), 1);
  
  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800/50';
    
    const intensity = count / maxCount;
    if (intensity <= 0.2) return 'bg-blue-200 dark:bg-blue-900/60';
    if (intensity <= 0.4) return 'bg-blue-300 dark:bg-blue-800/80';
    if (intensity <= 0.6) return 'bg-blue-400 dark:bg-blue-700';
    if (intensity <= 0.8) return 'bg-blue-500 dark:bg-blue-600';
    return 'bg-blue-600 dark:bg-blue-500';
  };

  // Determine month labels (which week starts a new month)
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const firstDayOfWeek = heatmapData[w * 7]?.date;
      if (!firstDayOfWeek) continue;
      const m = firstDayOfWeek.getMonth();
      if (m !== lastMonth) {
        labels.push({ weekIndex: w, label: format(firstDayOfWeek, 'MMM') });
        lastMonth = m;
      }
    }
    return labels;
  }, [heatmapData]);

  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="min-w-fit">
        <div className="flex relative h-5 mb-1" style={{ marginLeft: '30px' }}>
          {monthLabels.map((m, i) => (
            <div 
              key={i} 
              className="absolute text-[10px] font-semibold text-slate-500 dark:text-slate-400"
              style={{ left: `${m.weekIndex * (16 + 6)}px` }} // 16px width + 6px gap = 22px per column
            >
              {m.label}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 h-[148px] py-1">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>
          <div className="grid grid-flow-col gap-1.5" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
            {heatmapData.map((day, i) => (
              <div
                key={day.dateString}
                className={`w-4 h-4 rounded-sm ${getColor(day.count)} transition-all hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-300 cursor-help relative group`}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap z-10 pointer-events-none transition-opacity">
                  {day.count} activities on {format(day.date, 'MMM do, yyyy')}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 mt-4 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800/50"></div>
          <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900/60"></div>
          <div className="w-3 h-3 rounded-sm bg-blue-300 dark:bg-blue-800/80"></div>
          <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-700"></div>
          <div className="w-3 h-3 rounded-sm bg-blue-500 dark:bg-blue-600"></div>
          <div className="w-3 h-3 rounded-sm bg-blue-600 dark:bg-blue-500"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
