import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import prism from 'remark-prism';

const docsDirectory = path.join(process.cwd(), '/docs');
console.log(docsDirectory);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('docsDirectory', docsDirectory);
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
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

    return res.status(200).json({
      content,
      data: matterResult.data,
    });
  } catch (error) {
    console.error('Error reading documentation:', error);
    return res.status(404).json({ error: 'Documentation not found' });
  }
} 