export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  featured: boolean;
  tags: string[];
  readTime: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Evolution of International Criminal Law in the 21st Century',
    excerpt: 'An in-depth analysis of how international criminal law has adapted to contemporary challenges, including cyber crimes and environmental crimes against humanity.',
    content: `
      <p>International criminal law has undergone significant transformations in the 21st century, adapting to new forms of criminality and evolving notions of justice. This comprehensive analysis examines the key developments and challenges facing the international legal community.</p>
      
      <h2>Historical Context and Modern Challenges</h2>
      <p>The establishment of the International Criminal Court (ICC) in 2002 marked a watershed moment in international justice. However, the court has faced numerous challenges in its pursuit of accountability for the gravest crimes.</p>
      
      <h3>Technological Crimes and Jurisdiction</h3>
      <p>The rise of cyber warfare and digital crimes has posed new questions about jurisdiction and the application of traditional international criminal law principles. Courts must now grapple with crimes that transcend physical borders in unprecedented ways.</p>
      
      <blockquote>
        <p>"The digitization of conflict requires a fundamental rethinking of how we approach international criminal liability." - Prof. Sarah Johnson, International Law Institute</p>
      </blockquote>
      
      <h3>Environmental Crimes</h3>
      <p>There is growing momentum to recognize ecocide as an international crime, reflecting the urgent need to address environmental destruction through criminal law mechanisms.</p>
      
      <p>This evolution continues to shape how we understand justice, accountability, and the rule of law in our interconnected world.</p>
    `,
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    image: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
    category: 'International Criminal Law',
    featured: true,
    tags: ['ICC', 'Criminal Law', 'Justice', 'Human Rights'],
    readTime: 8
  },
  {
    id: '2',
    title: 'Climate Change Governance: Legal Frameworks for Global Action',
    excerpt: 'Exploring the intersection of environmental law and international governance in addressing climate change challenges.',
    content: `
      <p>Climate change represents one of the most pressing challenges of our time, requiring coordinated international legal frameworks and governance mechanisms.</p>
      
      <h2>The Paris Agreement and Beyond</h2>
      <p>The Paris Agreement established a framework for global climate action, but implementation challenges remain significant.</p>
    `,
    author: 'Prof. Michael Chen',
    date: '2024-01-12',
    image: '/src/assets/academic-building.jpg',
    category: 'Environmental Law',
    featured: false,
    tags: ['Climate Change', 'Environmental Law', 'Governance'],
    readTime: 6
  },
  {
    id: '3',
    title: 'Human Rights in the Digital Age: Privacy and Surveillance',
    excerpt: 'An examination of how digital technologies are reshaping human rights law and the balance between security and privacy.',
    content: `
      <p>The digital revolution has fundamentally altered the landscape of human rights protection, particularly in the realm of privacy and surveillance.</p>
    `,
    author: 'Dr. Emma Rodriguez',
    date: '2024-01-10',
    image: '/src/assets/law-books.jpg',
    category: 'Human Rights',
    featured: false,
    tags: ['Digital Rights', 'Privacy', 'Surveillance', 'Technology'],
    readTime: 7
  },
  {
    id: '4',
    title: 'Trade Law and Economic Sanctions: Contemporary Challenges',
    excerpt: 'Analyzing the role of economic sanctions in international law and their effectiveness in achieving policy objectives.',
    content: `
      <p>Economic sanctions have become an increasingly important tool in international relations, raising complex questions about their legal basis and effectiveness.</p>
    `,
    author: 'Prof. David Kim',
    date: '2024-01-08',
    image: '/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png',
    category: 'Trade Law',
    featured: false,
    tags: ['Trade Law', 'Sanctions', 'Economics', 'Policy'],
    readTime: 5
  },
  {
    id: '5',
    title: 'Transportation Law and International Mobility: A New Perspective',
    excerpt: 'Exploring the intersection of transportation law and international mobility in the modern era.',
    content: `
      <p>As global transportation networks become increasingly complex, the legal frameworks governing international mobility must adapt to new challenges and opportunities.</p>
      
      <h2>Modern Transportation Challenges</h2>
      <p>The integration of autonomous vehicles, electric transportation, and cross-border logistics presents unique legal challenges that require innovative solutions.</p>
      
      <h3>International Cooperation</h3>
      <p>Effective transportation law requires unprecedented levels of international cooperation and harmonization of regulations across jurisdictions.</p>
    `,
    author: 'Dr. Maria Santos',
    date: '2024-01-05',
    image: '/lovable-uploads/personcar2.jpeg',
    category: 'Transportation Law',
    featured: true,
    tags: ['Transportation', 'Mobility', 'International Law', 'Automotive'],
    readTime: 6
  }
];

export const featuredPosts = blogPosts.filter(post => post.featured);
export const recentPosts = blogPosts.slice(0, 3);