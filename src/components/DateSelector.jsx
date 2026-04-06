// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ChevronDown } from 'lucide-react';

export default function DateSelector({
  dates,
  selectedDate,
  onDateChange
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleDateSelect = date => {
    onDateChange(date);
    setIsOpen(false);
  };
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg px-4 py-2 text-amber-900 font-medium hover:bg-amber-50 transition-colors" style={{
      fontFamily: 'Nunito Sans, sans-serif'
    }}>
        <span>{selectedDate}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-amber-200 z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {dates.map(date => <button key={date} onClick={() => handleDateSelect(date)} className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${date === selectedDate ? 'bg-amber-100 text-amber-900 font-medium' : 'text-gray-700 hover:bg-amber-50'}`} style={{
          fontFamily: 'Nunito Sans, sans-serif'
        }}>
                {date}
              </button>)}
          </div>
        </div>}

      {/* 点击外部关闭下拉菜单 */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>;
}