import { redirect } from "next/navigation";

export default async function CourseIndexPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  redirect(`/academy/learn/${courseSlug}/intro`);
}
