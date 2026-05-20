"use client";
import { socialLink } from "@/constants/data";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { usePathname } from "next/navigation";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}
const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3", className)}>
        {socialLink.map(({ title, href, icon: Icon }) => (
          <Tooltip key={title}>
            <TooltipTrigger
              render={
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={title}
                  className="flex size-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-shop_light_green hover:text-shop_light_green hoverEffect"
                >
                  <Icon className={cn("size-[18px]", iconClassName)} />
                </a>
              }
            />
            <TooltipContent className={tooltipClassName}>
              {title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
