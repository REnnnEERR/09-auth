"use client";

import { use } from "react";


export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  return (
    <div className="p-10">
      <h1>Сторінка нотатки: {id}</h1>
      {/* Твій контент сторінки */}
    </div>
  );
}