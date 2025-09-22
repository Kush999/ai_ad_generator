import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Mockup } from "@/components/ui/mockup"
import { Glow } from "@/components/ui/glow"
import { Github } from "lucide-react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

interface HeroWithMockupProps {
  title: string
  description: string
  primaryCta?: {
    text: string
    href?: string
    onClick?: () => void
  }
  secondaryCta?: {
    text: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  mockupImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  className?: string
}

const GitHubIcon = () => (
  <Github className="mr-2 h-4 w-4" />
)

export function HeroWithMockup({
  title,
  description,
  primaryCta = {
    text: "Get Started",
    href: "/get-started",
  },
  secondaryCta = {
    text: "GitHub",
    href: "https://github.com/your-repo",
    icon: <GitHubIcon />,
  },
  mockupImage,
  className,
}: HeroWithMockupProps) {
  const { ref: mockupRef, isVisible: isMockupVisible } = useScrollAnimation()
  const { ref: contentRef, isVisible: isContentVisible } = useScrollAnimation()
  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden",
        className,
      )}
    >
      <div className="relative mx-auto max-w-[1280px] flex flex-col gap-12 lg:gap-24">
        <div 
          ref={contentRef}
          className={cn(
            "relative z-10 flex flex-col items-center gap-6 pt-8 md:pt-16 text-center lg:gap-12",
            "transition-all duration-1000 ease-out",
            isContentVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          )}
        >
          {/* Heading */}
          <h1
            className={cn(
              "inline-block",
              "bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground",
              "bg-clip-text text-transparent",
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
              "leading-[1.1] sm:leading-[1.1]",
              "drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]",
            )}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            className={cn(
              "max-w-[550px]",
              "text-base sm:text-lg md:text-xl",
              "text-muted-foreground",
              "font-medium",
            )}
          >
            {description}
          </p>

          {/* CTAs */}
          <div
            className="relative z-10 flex flex-wrap justify-center gap-4"
          >
            <Button
              asChild={!!primaryCta.href}
              size="lg"
              onClick={primaryCta.onClick}
              className={cn(
                "bg-gradient-to-b from-brand to-brand/90 dark:from-brand/90 dark:to-brand/80",
                "hover:from-brand/95 hover:to-brand/85 dark:hover:from-brand/80 dark:hover:to-brand/70",
                "text-white shadow-lg",
                "transition-all duration-300",
              )}
            >
              {primaryCta.href ? (
                <a href={primaryCta.href}>{primaryCta.text}</a>
              ) : (
                primaryCta.text
              )}
            </Button>

            <Button
              asChild={!!secondaryCta.href}
              size="lg"
              variant="ghost"
              onClick={secondaryCta.onClick}
              className={cn(
                "text-foreground/80 dark:text-foreground/70",
                "transition-all duration-300",
              )}
            >
              {secondaryCta.href ? (
                <a href={secondaryCta.href}>
                  {secondaryCta.icon}
                  {secondaryCta.text}
                </a>
              ) : (
                <>
                  {secondaryCta.icon}
                  {secondaryCta.text}
                </>
              )}
            </Button>
          </div>

          {/* Mockup */}
          <div className="relative w-full pt-12 px-4 sm:px-6 lg:px-8">
            <Mockup
              ref={mockupRef}
              className={cn(
                "transition-all duration-1000 ease-out",
                isMockupVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-8 scale-95",
                "shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]",
                "border-brand/10 dark:border-brand/5",
                "max-w-6xl mx-auto" // Increased size
              )}
            >
              <img
                {...mockupImage}
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </Mockup>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow
          variant="above"
          className={cn(
            "transition-all duration-2000 ease-out",
            isContentVisible 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-95"
          )}
        />
      </div>
    </section>
  )
}
