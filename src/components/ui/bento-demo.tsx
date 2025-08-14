import {
  BookOpen,
  Users,
  FileText,
  Globe,
  Calendar,
  GraduationCap,
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: FileText,
    name: "Cosmopolitan Bulletin",
    description: "Stay informed with our latest news, updates, and insights on international law and governance developments.",
    href: "/bulletin",
    cta: "Read Bulletin",
    background: <div className="absolute inset-0 bg-blue-50/20" />,
    className: "sm:col-span-2 lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Users,
    name: "Academic Team",
    description: "Meet our distinguished faculty members, researchers, and academic staff who are leading experts in international law.",
    href: "/team",
    cta: "Meet Our Team",
    background: <div className="absolute inset-0 bg-blue-50/20" />,
    className: "sm:col-span-2 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: BookOpen,
    name: "Blog Posts",
    description: "Explore our collection of research articles, academic insights, and expert analysis in international law.",
    href: "/blog",
    cta: "Read Blog",
    background: <div className="absolute inset-0 bg-blue-50/20" />,
    className: "sm:col-span-2 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Calendar,
    name: "Upcoming Events",
    description: "Stay updated with our conferences, seminars, and academic events focused on international law and governance.",
    href: "/events",
    cta: "View Events",
    background: <div className="absolute inset-0 bg-blue-50/20" />,
    className: "sm:col-span-2 lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: FileText,
    name: "Submit Research",
    description: "Contribute to our academic community by submitting your research papers, articles, and scholarly work.",
    href: "/submit-blog",
    cta: "Submit Now",
    background: <div className="absolute inset-0 bg-blue-50/20" />,
    className: "sm:col-span-2 lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };
