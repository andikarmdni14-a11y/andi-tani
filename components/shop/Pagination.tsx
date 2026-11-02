import Link from "next/link";
import { ChevronIcon } from "@/components/ui/icons";

type Props = {
  currentPage: number;
  totalPages: number;
  baseParams: Record<string, string | undefined>;
};

function buildHref(params: Props["baseParams"], page: number) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  if (page > 1) search.set("halaman", String(page));
  const qs = search.toString();
  return qs ? `/produk?${qs}` : "/produk";
}

// Nomor halaman dengan elipsis: 1 ... 4 5 6 ... 10
function pageWindow(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push("gap");
    result.push(page);
  });
  return result;
}

const itemClass =
  "touch-target inline-flex items-center justify-center rounded-lg px-3 text-sm font-semibold";

export default function Pagination({ currentPage, totalPages, baseParams }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Halaman katalog" className="mt-12 flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link href={buildHref(baseParams, currentPage - 1)} className={`${itemClass} hover:bg-border-subtle`} aria-label="Halaman sebelumnya">
          <ChevronIcon direction="left" />
        </Link>
      ) : (
        <span className={`${itemClass} text-border-subtle`} aria-hidden>
          <ChevronIcon direction="left" />
        </span>
      )}

      {pageWindow(currentPage, totalPages).map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-text-muted" aria-hidden>
            ...
          </span>
        ) : item === currentPage ? (
          <span key={item} aria-current="page" className={`${itemClass} bg-brand-primary text-surface-light`}>
            {item}
          </span>
        ) : (
          <Link key={item} href={buildHref(baseParams, item)} className={`${itemClass} hover:bg-border-subtle`}>
            {item}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link href={buildHref(baseParams, currentPage + 1)} className={`${itemClass} hover:bg-border-subtle`} aria-label="Halaman berikutnya">
          <ChevronIcon direction="right" />
        </Link>
      ) : (
        <span className={`${itemClass} text-border-subtle`} aria-hidden>
          <ChevronIcon direction="right" />
        </span>
      )}
    </nav>
  );
}
