type AdminStatCardProps = {
  label: string;
  value: string | number;
  description: string;
};

export default function AdminStatCard({
  label,
  value,
  description,
}: AdminStatCardProps) {
  return (
    <div className="rounded-3xl border border-divider bg-bg-primary/85 p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-subtle">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-title">{value}</p>
      <p className="mt-2 text-sm leading-6 text-subtle">{description}</p>
    </div>
  );
}