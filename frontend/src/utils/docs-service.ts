import { remark } from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  sections: DocSection[];
}

export interface DocSection {
  id: string;
  title: string;
  path: string;
  content?: string;
  subsections?: DocSubsection[];
}

export interface DocSubsection {
  id: string;
  title: string;
  anchor: string;
}

export const getDocCategories = (): DocCategory[] => {
  return [
    {
      id: 'get_started',
      title: 'Get Started',
      description: 'Quick start guides and basic setup instructions',
      sections: [
        { id: '1-introduction', title: 'Introduction', path: '1-introduction' },
        { id: '2-installation-and-setup', title: 'Installation & Setup', path: '2-installation-and-setup' },
      ],
    },
    {
      id: 'features',
      title: 'Features',
      description: 'Explore platform features and capabilities',
      sections: [
        { id: '3-system-configuration', title: 'System Configuration', path: '3-system-configuration' },
        { id: '4-database-management-and-sync', title: 'Database Management', path: '4-database-management-and-sync' },
        { id: '5-user-interface-and-frontend', title: 'User Interface', path: '5-user-interface-and-frontend' },
      ],
    },
    {
      id: 'customization',
      title: 'Customization',
      description: 'Learn how to customize and extend the platform',
      sections: [
        { id: '6-developer-documentation', title: 'Developer Documentation', path: '6-developer-documentation' },
        { id: '8-contribution-guidelines', title: 'Contribution Guidelines', path: '8-contribution-guidelines' },
      ],
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Security best practices and configurations',
      sections: [
        { id: '7-troubleshooting-and-faq', title: 'Troubleshooting & FAQ', path: '7-troubleshooting-and-faq' },
        { id: '9-changelog-and-roadmap', title: 'Changelog & Roadmap', path: '9-changelog-and-roadmap' },
        // { id: '10-licensing-and-contact', title: 'Licensing & Contact', path: '10-licensing-and-contact' },
      ],
    },
  ];
};

export const getAllDocPaths = (): string[] => {
  const categories = getDocCategories();
  const paths: string[] = [];

  categories.forEach(category => {
    category.sections.forEach(section => {
      paths.push(section.id);
    });
  });

  return paths;
};

export const getDocBySlug = (slug: string): DocSection | null => {
  const categories = getDocCategories();
  let docSection: DocSection | null = null;

  categories.forEach(category => {
    category.sections.forEach(section => {
      if (section.id === slug) {
        docSection = { ...section };
      }
    });
  });

  return docSection;
}; 