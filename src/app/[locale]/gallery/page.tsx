import { redirect } from "next/navigation";

export default async function GalleryIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/gallery/photo`);
}
