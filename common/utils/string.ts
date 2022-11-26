const fieldToTitle = (field: string): string =>
  (field.charAt(0).toUpperCase() + field.substr(1).toLowerCase())
    .replace('_id', '')
    .replace(/_|-/g, ' ');

const partialMatcher = (term: string) =>
  term && term.length > 0 ? `%${term.toString().replace(/\s|-/g, '_')}%` : undefined;

const slugify = (string: string) => string.trim().toLowerCase().replace(/\s+/g, '-');

export { fieldToTitle, partialMatcher, slugify };
