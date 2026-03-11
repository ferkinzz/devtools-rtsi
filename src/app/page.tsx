import { redirect } from "next/navigation";
import { DevPanel } from "@/dev/DevPanel";

export default function DevPage() {
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  return <DevPanel />;
}

export const metadata = {
  title: "Dev Panel",
  robots: "noindex, nofollow",
};
