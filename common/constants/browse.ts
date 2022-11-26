import { CategoryType } from 'types/views/browse';
import { slugify } from 'common/utils/string';

import BROWSE_DATA from './browseData';

const browseDataByUrl: Record<string, CategoryType> = {};
const browseScreens: Record<string, string> = {};

function recursivelyAddFields(parent: CategoryType, level: number) {
  if (!parent.slug) parent.slug = slugify(parent.name);
  if (!parent.url) parent.url = parent.slug;
  if (!parent.tree) parent.tree = parent.name;
  if (!parent.filterKey) parent.filterKey = `category_level_${<1 | 2 | 3 | 4>level}`;
  browseDataByUrl[parent.url] = parent;
  browseScreens[parent.url] = parent.url;

  (parent.children || []).forEach((child) => {
    child.slug = child.name.toLowerCase().replace(/ /g, '-');
    child.url = `${parent.url}/${child.slug || ''}`;
    child.tree = `${parent.tree}\\${child.name || ''}`;
    if (!child.children) child.children = [];

    recursivelyAddFields(child, level + 1);
  });
}

(<CategoryType[]>BROWSE_DATA).forEach((d) => recursivelyAddFields(d, 1));

browseScreens.browse = 'browse';

export default BROWSE_DATA;
export { browseDataByUrl, browseScreens };
