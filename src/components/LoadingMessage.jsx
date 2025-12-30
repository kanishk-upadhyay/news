export default function LoadingMessage({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center py-16 sm:py-24 lg:py-32">
      <div className="text-xl sm:text-2xl on-surface-variant font-medium">
        {message}
      </div>
    </div>
  );
}
