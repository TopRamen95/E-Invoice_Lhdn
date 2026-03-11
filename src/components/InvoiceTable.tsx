import type { Invoice } from "@/types";
import StatusBadge from "./StatusBadge";
import { fmt, fmtDate, fmtTime } from "@/utils";
import { Download } from "lucide-react";

interface Props {
  invoices: Invoice[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onSelect: (inv: Invoice) => void;
  fullHeight?: boolean;
}

export default function InvoiceTable({
  invoices,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onSelect,
  fullHeight = false,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);

  const exportCSV = () => {
    const cols: (keyof Invoice)[] = [
      "invoice_id",
      "issue_date",
      "issue_time",
      "invoice_type_code",
      "supplier_registration_name",
      "customer_registration_name",
      "STATUS",
      "payable_amount",
    ];
    const rows = [
      cols.join(","),
      ...invoices.map((r) =>
        cols.map((c) => JSON.stringify(r[c] ?? "")).join(",")
      ),
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([rows.join("\n")], { type: "text/csv" })
    );
    a.download = `invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div
      className={`flex-1 flex flex-col rounded-xl border`}
      style={{ background: "#fff", borderColor: "var(--border)", minHeight: 0 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-none"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: "var(--text)" }}>
            Total Records
          </span>
          {total > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "#e0f2fe", color: "#0284c7" }}
            >
              {total.toLocaleString()}
            </span>
          )}
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all hover:shadow-sm"
          style={{ background: "var(--bg3)", borderColor: "var(--border)", color: "var(--text2)" }}
        >
          <Download size={11} /> Export CSV
        </button>
      </div>

      {/* Table body with reduced height */}
      <div
        className="flex-1 min-h-0 overflow-auto w-full"
        style={{ maxHeight: 'calc(100vh - 200px)' }} // reduced height for viewport fit
      >
        <table className="w-full border-collapse table-auto">
          <thead className="sticky top-0 z-10 bg-[#f8fafc]">
            <tr>
              {COLS.map((c) => (
                <th
                  key={c.key}
                  className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: "var(--text3)", borderBottom: "1px solid var(--border)" }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-top">
            {loading ? (
              <tr>
                <td
                  colSpan={COLS.length}
                  className="text-center text-xs"
                  style={{ color: "var(--text3)", padding: "3rem 0" }}
                >
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <div
                      className="w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: "var(--border2)", borderTopColor: "var(--accent)" }}
                    />
                    Loading invoices…
                  </div>
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={COLS.length}
                  className="text-center text-xs"
                  style={{ color: "var(--text3)", padding: "3rem 0" }}
                >
                  No records found
                </td>
              </tr>
            ) : (
              invoices.map((inv, i) => (
                <tr
                  key={inv.invoice_id + i}
                  onClick={() => onSelect(inv)}
                  className="cursor-pointer border-b transition-colors duration-100 hover:bg-[#f0f9ff]"
                  style={{ borderColor: "var(--border)" }}
                >
                  {COLS.map((c) => (
                    <td
                      key={c.key}
                      className="px-3 py-2.5 text-xs whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ color: "var(--text2)" }}
                    >
                      {c.render(inv)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-t text-xs flex-none"
        style={{ borderColor: "var(--border)", background: "#fafafa", color: "var(--text3)" }}
      >
        <span>
          {total > 0
            ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total.toLocaleString()}`
            : "No records"}
        </span>
        <div className="flex gap-1">
          <PgBtn label="«" onClick={() => onPageChange(1)} disabled={page === 1} />
          <PgBtn label="‹" onClick={() => onPageChange(page - 1)} disabled={page === 1} />
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = Math.max(1, page - 3) + i;
            if (p > totalPages) return null;
            return <PgBtn key={p} label={String(p)} onClick={() => onPageChange(p)} active={p === page} />;
          })}
          <PgBtn label="›" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} />
          <PgBtn label="»" onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} />
        </div>
      </div>
    </div>
  );
}

function PgBtn({ label, onClick, disabled, active }: { label: string; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="min-w-[26px] h-6 px-1.5 rounded border text-[11px] transition-all disabled:opacity-30"
      style={
        active
          ? { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff", fontWeight: 700 }
          : { background: "#fff", borderColor: "var(--border)", color: "var(--text2)" }
      }
    >
      {label}
    </button>
  );
}

const COLS = [
  { key: "issue_date", label: "Issue Date", render: (r: Invoice) => fmtDate(r.issue_date) },
  { key: "issue_time", label: "Issue Time", render: (r: Invoice) => fmtTime(r.issue_time) },
  { key: "env", label: "Env Version", render: (r: Invoice) => fmt(r.list_version_id) },
  { key: "invoice_id", label: "Invoice No", render: (r: Invoice) => <span className="font-mono font-semibold" style={{ color: "var(--accent)" }}>{fmt(r.invoice_id)}</span> },
  { key: "inv_date", label: "Invoice Date", render: (r: Invoice) => fmtDate(r.issue_date) },
  { key: "type", label: "Invoice Type", render: (r: Invoice) => fmt(r.invoice_type_code) },
  { key: "supplier", label: "Supplier Name", render: (r: Invoice) => <span title={r.supplier_registration_name}>{fmt(r.supplier_registration_name)}</span> },
  { key: "buyer", label: "Buyer Name", render: (r: Invoice) => <span title={r.customer_registration_name}>{fmt(r.customer_registration_name)}</span> },
  { key: "STATUS", label: "Status", render: (r: Invoice) => <StatusBadge status={r.STATUS} /> },
];