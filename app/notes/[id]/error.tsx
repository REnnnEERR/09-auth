"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
    </div>
  );
}