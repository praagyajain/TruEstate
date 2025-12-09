import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SalesTable = ({
  transactions,
  currentPage = 1,
  onPageChange,
  totalPages = 6,
  loading = false,
  hasNext = false,
  hasPrev = false,
}) => {
  const [page, setPage] = useState(currentPage);
  const [pageChanging, setPageChanging] = useState(false);

  useEffect(() => {
    setPage(currentPage);
    if (!loading) setPageChanging(false);
  }, [currentPage, loading]);

  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    setPage(newPage);
    setPageChanging(true);
    onPageChange?.(newPage);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-pink-500",
      "bg-orange-500",
      "bg-green-500",
      "bg-indigo-500",
    ];
    if (!name || typeof name !== "string" || name.length === 0) return colors[0];
    return colors[name.charCodeAt(0) % colors.length];
  };

  let countryCode = "+91";

  const formatDate = (d) => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return String(d).split("T")[0] || String(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return (
    <div className="bg-white border-t border-gray-200">
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Customer ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Customer name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Phone Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Gender
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Age
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Product Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Total Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Payment Method
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Customer Region
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                Product Id
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.customerId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {transaction.avatar ? (
                      <img
                        src={transaction.avatar}
                        alt={transaction.customerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(
                          transaction.customerName
                        )}`}
                      >
                        {(transaction.customerName && transaction.customerName.charAt(0).toUpperCase()) || "?"}
                      </div>
                    )}
                    {transaction.customerName}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {countryCode} {transaction.phoneNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.gender}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.age}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.productCategory}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  $ {transaction.finalAmount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.paymentMethod}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.region}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                  {transaction.productId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="sticky bottom-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <div className="flex items-center gap-2">
          
          {(() => {
            const maxButtons = 7;
            const half = Math.floor(maxButtons / 2);
            let start = Math.max(1, page - half);
            let end = Math.min(totalPages, page + half);
            if (end - start + 1 < maxButtons) {
              if (start === 1) end = Math.min(totalPages, start + maxButtons - 1);
              else if (end === totalPages) start = Math.max(1, end - maxButtons + 1);
            }

            const pages = [];
            if (start > 1) {
              pages.push(1);
              if (start > 2) pages.push("...");
            }
            for (let p = start; p <= end; p++) pages.push(p);
            if (end < totalPages) {
              if (end < totalPages - 1) pages.push("...");
              pages.push(totalPages);
            }

            return pages.map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-500">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-12 h-8 flex items-center justify-center rounded-lg transition ${page === p
                    ? "bg-gray-900 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              )
            );
          })()}
        </div>

        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={!hasNext && page >= totalPages}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SalesTable;
