export default function Input({
  name,
  value,
  onChange,
  type = "text",
  placeholder
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className="w-full p-3 border rounded-lg"
    />
  );
}