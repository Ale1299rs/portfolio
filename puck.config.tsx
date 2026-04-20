import type { Config } from "@measured/puck";
import { Container } from "@/components/ui/Container";

import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DashboardDemo } from "@/components/sections/DashboardDemo";
import { ProjectsPreview } from "@/components/sections/ProjectsPreview";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ChatBanner } from "@/components/sections/ChatBanner";

// Base props for typography that we'll inject into Puck blocks
export type BaseProps = {
  fontFamily: "Inter" | "Outfit" | "Roboto" | "geist";
  fontSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  textAlign?: "left" | "center" | "right";
  color?: string;
};

const typographyFields = {
  fontFamily: {
    type: "select" as const,
    options: [
      { label: "Inter", value: "Inter" },
      { label: "Outfit", value: "Outfit" },
      { label: "Geist", value: "geist" },
    ],
  },
  color: { type: "text" as const },
};

// Define the blocks available in our Puck visual editor
export type Props = {
  HeroBlock: { title: string; description: string; badge: string; cta: string } & BaseProps;
  TextBlock: { content: string } & BaseProps;
  ServicesBlock: BaseProps;
  DashboardDemoBlock: BaseProps;
  ProjectsPreviewBlock: BaseProps;
  ProcessBlock: BaseProps;
  ChatBannerBlock: BaseProps;
};

export const config: Config<Props> = {
  components: {
    HeroBlock: {
      fields: {
        badge: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        cta: { type: "text" },
        ...typographyFields,
        fontSize: {
          type: "select",
          options: [
            { label: "Base", value: "base" },
            { label: "Large", value: "lg" },
            { label: "2XL", value: "2xl" },
            { label: "4XL", value: "4xl" },
          ],
        },
        textAlign: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        badge: "Portfolio",
        title: "Trasformo dati in decisioni",
        description: "Descrizione del portfolio",
        cta: "Guarda i progetti",
        fontFamily: "Inter",
        fontSize: "4xl",
        textAlign: "left",
      },
      render: ({ badge, title, description, cta, fontFamily, fontSize, textAlign, color }) => {
        // Map our visual props back to tailwind or inline styles
        const textAlignClass = `text-${textAlign}`;
        const fontSizeClass = `text-${fontSize}`;
        
        return (
          <section className="pb-12 pt-16 sm:pt-24" style={{ fontFamily }}>
            <Container size="wide">
              <div className="flex flex-col items-start gap-12 sm:flex-row">
                <div className={`max-w-2xl flex-1 ${textAlignClass}`}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {badge}
                  </span>
                  <h1 className={`mt-6 font-semibold tracking-tight ${fontSizeClass}`} style={{ color: color }}>
                    {title}
                  </h1>
                  <p className="mt-6 text-lg leading-relaxed text-muted">
                    {description}
                  </p>
                  <div className="mt-8">
                    <a className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent/90" href="/work">
                      {cta}
                    </a>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        );
      },
    },
    
    TextBlock: {
      fields: {
        content: { type: "textarea" },
        ...typographyFields,
        fontSize: {
          type: "select",
          options: [
            { label: "Small", value: "sm" },
            { label: "Base", value: "base" },
            { label: "Large", value: "lg" },
            { label: "XL", value: "xl" },
          ],
        },
        textAlign: {
          type: "radio",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
      },
      defaultProps: {
        content: "Scrivi qui il tuo testo...",
        fontFamily: "Inter",
        fontSize: "base",
        textAlign: "left",
      },
      render: ({ content, fontFamily, fontSize, textAlign, color }) => {
        return (
          <div 
            className={`text-${textAlign} text-${fontSize}`} 
            style={{ fontFamily: fontFamily, color: color }}
          >
            {content}
          </div>
        );
      }
    },

    ServicesBlock: {
      fields: { ...typographyFields },
      defaultProps: { fontFamily: "Inter" },
      render: ({ fontFamily, color }) => (
        <div style={{ fontFamily, color }} className="puck-wrapper">
          <ServicesSection />
        </div>
      ),
    },

    DashboardDemoBlock: {
      fields: { ...typographyFields },
      defaultProps: { fontFamily: "Inter" },
      render: ({ fontFamily, color }) => (
        <div style={{ fontFamily, color }} className="puck-wrapper">
          <DashboardDemo />
        </div>
      ),
    },

    ProjectsPreviewBlock: {
      fields: { ...typographyFields },
      defaultProps: { fontFamily: "Inter" },
      render: ({ fontFamily, color }) => (
        <div style={{ fontFamily, color }} className="puck-wrapper">
          <ProjectsPreview />
        </div>
      ),
    },

    ProcessBlock: {
      fields: { ...typographyFields },
      defaultProps: { fontFamily: "Inter" },
      render: ({ fontFamily, color }) => (
        <div style={{ fontFamily, color }} className="puck-wrapper">
          <ProcessSection />
        </div>
      ),
    },

    ChatBannerBlock: {
      fields: { ...typographyFields },
      defaultProps: { fontFamily: "Inter" },
      render: ({ fontFamily, color }) => (
        <div style={{ fontFamily, color }} className="puck-wrapper">
          <ChatBanner />
        </div>
      ),
    },
  },
};

