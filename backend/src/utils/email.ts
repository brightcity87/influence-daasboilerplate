

interface EmailTemplateVars {
  [key: string]: string | number | boolean | null | undefined;
}
type EmailOverrideVars = string[]; // array of variables
export const renderTemplate = (template: string, variables: EmailTemplateVars): string => {
  let rendered = template || '';
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, String(value));
  });
  return rendered;
};

export const getEmailTemplate = async (name: string, variables: EmailTemplateVars, overrideVariables: EmailOverrideVars = []) => {
  const template = await strapi.db.query('api::email-template.email-template').findOne({
    where: { name, publishedAt: { $not: null } }
  });

  if (!template) {
    throw new Error(`Email template "${name}" not found`);
  }
  // let defaultVariables = template.variables;
  // try {
  //   defaultVariables = JSON.parse(template.variables);
  // } catch (error) {
  //   console.log(template.variables, typeof template.variables);
  //   console.error('Error parsing email template variables:', error);
  // }
  let finalVariables = template.variables;
  if (Object.keys(variables).length > 0) {
    finalVariables = { ...variables, ...finalVariables };
  }
  if (overrideVariables.length > 0) {
    overrideVariables.forEach(variable => {
      finalVariables[variable] = variables[variable];
    });
  }

  // Convert Strapi blocks to HTML if htmlBody is a blocks object
  let htmlContent = convertStrapiBlocksToHtml(template.htmlBody);

  return {
    subject: renderTemplate(template.subject, finalVariables),
    htmlBody: renderTemplate(htmlContent, finalVariables),
    textBody: renderTemplate(template.textBody, finalVariables),
  };

};

const convertStrapiBlocksToHtml = (blocks: any[]): string => {
  if (!Array.isArray(blocks)) return '';

  return blocks.reduce((html: string, block: any) => {
    if (!block || typeof block !== 'object') return html;
    switch (block.type) {
      case 'paragraph':
        return html + `<p>${block.children.map((child: any) => child.text).join('')}</p>`;

      case 'quote':
        return html + `<blockquote>${block.children.map((child: any) => child.text).join('')}</blockquote>`;

      case 'code':
        return html + `<pre><code>${block.children.map((child: any) => child.text).join('')}</code></pre>`;

      case 'heading':
        const level = block.level || 1;
        return html + `<h${level}>${block.children.map((child: any) => child.text).join('')}</h${level}>`;

      case 'link':
        return html + `<a href="${block.url}">${block.children.map((child: any) => child.text).join('')}</a>`;

      case 'list':
        const listType = block.format === 'ordered' ? 'ol' : 'ul';
        const listItems = block.children
          .map((item: any) => `<li>${item.children.map((child: any) => child.text).join('')}</li>`)
          .join('');
        return html + `<${listType}>${listItems}</${listType}>`;

      case 'image':
        const alt = block.image?.alternativeText || '';
        return html + `<img src="${block.image?.url}" alt="${alt}" />`;

      default:
        // Handle any text modifiers like bold, italic etc
        let text = block.children?.map((child: any) => {
          let content = child.text;
          if (child.bold) content = `<strong>${content}</strong>`;
          if (child.italic) content = `<em>${content}</em>`;
          if (child.underline) content = `<u>${content}</u>`;
          if (child.strikethrough) content = `<del>${content}</del>`;
          if (child.code) content = `<code>${content}</code>`;
          return content;
        }).join('') || '';
        return html + text;
    }
  }, '');
};
