export default function LoadingMessage({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center py-32">
      <div className="text-2xl on-surface-variant font-medium">{message}</div>
    </div>
  );
}
