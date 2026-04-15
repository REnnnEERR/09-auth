"use client";

export default function FilterNotesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>Something went wrong while loading filtered notes.</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
``