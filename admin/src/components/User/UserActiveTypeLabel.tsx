import React from "react";

const typeColorMap: Record<string, string> = {
  inactive: "#f42",
  active: "#7c5",
};

type Props = {
  type: string;
};

export default function UserActiveType({ type }: Props) {
  return (
    <span
      className="text-white d-inline-block text-uppercase text-center rounded-1 shadow-sm"
      style={{
        backgroundColor: typeColorMap[type],
        textShadow: "1px 1px 2px rgb(0 0 0 / 70%)",
        fontSize: ".7rem",
        width: "70px",
      }}
    >
      {type}
    </span>
  );
}
