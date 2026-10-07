export default function Toast({ message, type = "success" }) {
  return (
    <div
      className={`
        fixed
        top-5
        right-5
        z-50
        px-5
        py-3
        rounded-lg
        shadow-lg
        text-sm
        font-medium
        ${
          type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }
      `}
    >
      {message}
    </div>
  );
}