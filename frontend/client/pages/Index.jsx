import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import SalesTable from "@/components/SalesTable";
import { BarChart3, IndianRupee, Gift } from "lucide-react";
const DEFAULT_LIMIT = 10;

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Math.max(Number(searchParams.get("page")) || 1, 1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [stats, setStats] = useState({ totalUnits: 0, totalRevenue: 0, totalDiscount: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const pageFromParams = Math.max(Number(searchParams.get("page")) || 1, 1);
    if (pageFromParams !== currentPage) {
      setCurrentPage(pageFromParams);
    }
  }, [searchParams]);

  const statsData = [
    {
      title: "Total units sold",
      value: statsLoading ? "..." : stats.totalUnits ?? 0,
      icon: <BarChart3 size={24} />,
      color: "bg-orange-50",
    },
    {
      title: "Total revenue",
      value: statsLoading ? "..." : `₹${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <IndianRupee size={24} />,
      color: "bg-yellow-50",
    },
    {
      title: "Total Discount",
      value: statsLoading ? "..." : `₹${Number(stats.totalDiscount || 0).toLocaleString()}`,
      icon: <Gift size={24} />,
      color: "bg-blue-50",
    },
  ];

  useEffect(() => {
    const abortStats = new AbortController();
    async function loadStats() {
      try {
        setStatsLoading(true);
        const qp = new URLSearchParams(Object.fromEntries(searchParams.entries()));
        const url = `http://localhost:4000/api/sales/stats/`;
        const res = await fetch(url, { signal: abortStats.signal });
        console.log("Stats Response", res);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        setStats(body.stats || { totalUnits: 0, totalRevenue: 0, totalDiscount: 0 });
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('stats load error', err);
      } finally {
        setStatsLoading(false);
      }
    }
    loadStats();

    const abort = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const qp = new URLSearchParams(Object.fromEntries(searchParams.entries()));
        qp.set("page", String(currentPage));
        qp.set("limit", String(DEFAULT_LIMIT));

        const url = `http://localhost:4000/api/sales?${qp.toString()}`;
        const res = await fetch(url, { signal: abort.signal });
        console.log("Response", res);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        console.log("Response Body", body);

        const mapped = (body.data || []).map((it) => {
          const idSource = it._id || it.id || "";
          const raw = String(idSource || "");
          let num;
          if (raw && /^[0-9a-fA-F]+$/.test(raw)) {
            num = parseInt(raw.slice(-8), 16) % 10000;
          } else {
            num = Math.floor(Math.random() * 10000);
          }
          const txNumeric = "TX-" + String(num).padStart(4, "0");
          return {
            ...it,
            transactionId: txNumeric,
            customerId: it.customerId || it.customerId || null,
            customerName: it.customerName || it.customerName || (it.customer && it.customer.name) || "",
            phoneNumber: it.phoneNumber || it.phone || (it.customer && it.customer.phone) || "",
            productCategory: it.productCategory || (it.product && it.product.category) || "",
          };
        });
        setTransactions(mapped);
        const meta = body.meta || {};
        const total = meta.total ?? body.total ?? 0;
        setTotalPages(Math.max(1, meta.totalPages ?? Math.ceil(total / DEFAULT_LIMIT)));
        setHasNext(Boolean(meta.hasNext));
        setHasPrev(Boolean(meta.hasPrev));
        if (meta.page && Number(meta.page) !== currentPage) {
          setCurrentPage(Number(meta.page));
        }
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => abort.abort();
  }, [currentPage, searchParams]);
  useEffect(() => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(currentPage));
      return p;
    });
  }, [currentPage, setSearchParams]);

  return (
    <div className="flex h-screen bg-background">
      
      <Sidebar />

      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <Header onFiltersChange={(newFilters) => {

          const displayToSortKey = {
            "Customer Name (A-Z)": "customer_asc",
            "Customer Name (Z-A)": "customer_desc",
            "Date (Newest)": "date_desc",
            "Date (Oldest)": "date_asc",
          };

          setSearchParams((prev) => {
            const p = new URLSearchParams(prev);
            Object.entries(newFilters || {}).forEach(([k, v]) => {
              if (k === "sortBy") {
                const sortKey = displayToSortKey[v];
                if (sortKey) p.set("sort", sortKey);
                else p.delete("sort");
                return;
              }

              if (v === undefined || v === null || v === "") p.delete(k);
              else p.set(k, v);
            });
            p.set("page", "1");
            return p;
          });
        }} />

        
        <StatsCards stats={statsData} />

        
        <div className="flex-1 overflow-y-auto relative">
          {error ? (
            <div className="p-4 text-red-600">Error loading sales: {error}</div>
          ) : (
            <>
              
              {loading && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/40 backdrop-blur-sm backdrop-filter">
                  <div className="flex items-center gap-3">
                    <svg className="h-6 w-6 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span className="text-sm text-gray-700">Loading…</span>
                  </div>
                </div>
              )}

              {!loading && (
                <SalesTable
                  transactions={transactions}
                  loading={loading}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalPages={totalPages}
                  hasNext={hasNext}
                  hasPrev={hasPrev}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
