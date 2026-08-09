import React from "react";
import { ERPLayout } from "@/components/layout/ERPLayout";

export default function ErpRouteLayout({ children }: { children: React.ReactNode }) {
  return <ERPLayout>{children}</ERPLayout>;
}

