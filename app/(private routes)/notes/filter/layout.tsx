import React from "react";

type Props = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
};

export default function FilterLayout(props: Props) {
  const { children, sidebar } = props;

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {sidebar && <aside style={{ width: "250px" }}>{sidebar}</aside>}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}