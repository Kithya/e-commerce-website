import {
  Camera,
  MessageCircle,
  Send,
  Video,
  type LucideIcon,
} from "lucide-react";

export const headerData = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Shop",
    href: "/shop",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  //   {
  //     title: "Contact",
  //     href: "/contact",
  //   },
  {
    title: "Hot Deal",
    href: "/deal",
  },
];

export type SocialLink = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const socialLink: SocialLink[] = [
  {
    title: "Instagram",
    href: "https://www.instagram.com",
    icon: Camera,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com",
    icon: MessageCircle,
  },
  {
    title: "X",
    href: "https://x.com",
    icon: Send,
  },
  {
    title: "YouTube",
    href: "https://www.youtube.com",
    icon: Video,
  },
];

