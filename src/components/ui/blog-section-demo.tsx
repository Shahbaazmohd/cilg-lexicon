import { BlogSection } from "@/components/ui/blog-section";

// Mock data for demonstration
const mockPosts = [
  {
    id: "1",
    title: "International Trade Law in the Digital Age",
    excerpt: "Examining the challenges and opportunities presented by digital transformation in international trade law and its implications for global commerce.",
    image_url: "/src/assets/law-books.jpg",
    category: "Trade Law",
    created_at: "2024-01-15"
  },
  {
    id: "2", 
    title: "Human Rights Protection in Conflict Zones",
    excerpt: "A comprehensive analysis of international human rights law and its application in conflict-affected regions around the world.",
    image_url: "/src/assets/academic-building.jpg",
    category: "Human Rights",
    created_at: "2024-01-10"
  },
  {
    id: "3",
    title: "Climate Governance and Legal Frameworks",
    excerpt: "Exploring the intersection of environmental law and international governance in addressing climate change challenges.",
    category: "Environmental Law",
    created_at: "2024-01-05"
  },
  {
    id: "4",
    title: "Digital Sovereignty and International Law",
    excerpt: "Analyzing the concept of digital sovereignty and its implications for international law and cross-border data governance.",
    category: "Digital Law",
    created_at: "2024-01-01"
  }
];

function BlogSectionDemo() {
  return (
    <div className="w-full">
      <BlogSection posts={mockPosts} />
    </div>
  );
}

export { BlogSectionDemo }; 