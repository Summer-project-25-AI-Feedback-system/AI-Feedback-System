type AveragePointsProgressBarProps = {
  value: number; 
};

export default function AveragePointsProgressBar({ value }: AveragePointsProgressBarProps) {
return (
    <div className="w-full">
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1D1B20] transition-all duration-300 ease-in-out"
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="text-right text-sm text-gray-600 mt-1">
        {value}%
      </div>
    </div>
  );
}