export default function LoadError({ what }: { what: string }) {
  return (
    <div role="alert" className="rounded-2xl border border-border-subtle px-6 py-10 text-center">
      <p className="font-semibold">{what} belum bisa dimuat.</p>
      <p className="mt-1 text-sm text-text-muted">
        Periksa koneksi internet, lalu muat ulang halaman ini.
      </p>
    </div>
  );
}
