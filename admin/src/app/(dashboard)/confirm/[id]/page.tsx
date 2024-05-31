import ConfirmDetail from "@/components/Confirm/ConfirmDetail";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const ConfirmDetailPage = async ({ params }: { params: { id: string } }) => {
  const res = await fetch(`http://localhost:3056/api/v1/confirm/${params.id}`, {
    cache: "no-cache",
  });
  const { metadata } = await res.json();
  const {
    _id,
    status,
    phone,
    firstName,
    lastName,
    email,
    dob,
    citizen_id,
    citizen_images,
    createdAt,
    updatedAt,
  } = metadata;


  return (
    <div className="d-flex justify-content-between w-100">
      <ConfirmDetail metadata={metadata} />
    </div>
  );
};

export default ConfirmDetailPage;
