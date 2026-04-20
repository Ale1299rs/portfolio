import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DashboardDemo } from "@/components/sections/DashboardDemo";
import { ProjectsPreview } from "@/components/sections/ProjectsPreview";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ChatBanner } from "@/components/sections/ChatBanner";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServicesSection />
      <ProjectsPreview />
      <DashboardDemo />
      <ProcessSection />
      <ChatBanner />
    </>
  );
}
