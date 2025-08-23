type StudentTableDropdownProps = {
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

export default function StudentTableDropdown({ options, value, onChange }: StudentTableDropdownProps) {
  return (
    <select
      className="border px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}