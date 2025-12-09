import { TrendingUp, AlertCircle } from "lucide-react";

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              {stat.trend && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">
                    {stat.trend}
                  </span>
                  {stat.trendValue !== undefined && (
                    <span
                      className={`text-xs font-semibold ${
                        stat.trendValue >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.trendValue >= 0 ? "+" : ""}
                      {stat.trendValue}%
                    </span>
                  )}
                </div>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color || "bg-blue-50"
              }`}
            >
              <div className="text-gray-700">{stat.icon}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
