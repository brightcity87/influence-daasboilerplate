import { remark } from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), '/docs');
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

// Define the interfaces
export interface DocNode {
  content: string;
  data: {
    [key: string]: any;
  };
}

export interface DocNodeError {
  error: string;
}


export const getDocNode = async ({ slug }: { slug: string }): Promise<DocNode | DocNodeError> => {

  if (typeof slug !== 'string') {
    return { error: 'Invalid slug' }
  }

  try {
    const fullPath = path.join(docsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .use(prism as any)
      .process(matterResult.content);

    const content = processedContent.toString();

    return {
      content,
      data: matterResult.data,
    }
  } catch (error) {
    console.error('Error reading documentation:', error);
    return { error: 'Documentation not found' }
  }
} 