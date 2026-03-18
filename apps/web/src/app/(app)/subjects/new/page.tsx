import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { CreateSubjectForm } from "./create-subject-form";

export default async function NewSubjectPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/subjects/new");

  return <CreateSubjectForm />;
}
