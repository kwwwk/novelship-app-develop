const buildQueryString = (params: Record<string, string | number | boolean>) =>
  Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .map((key: string) => `${key}=${encodeURIComponent(params[key].toString())}`)
    .join('&');

export type APIQueryParamsType = {
  ignoreActive?: boolean;
  filter?: Record<string, unknown>;
  modifier?: Record<string, string | number | boolean>;
  include?: string[];
  includeFields?: Record<string, string[]>;
  folder_name?: string;
  file_name?: string;
  file_type?: string;
  bucket_name?: string;
  sort?: string;
  page?: {
    size?: number;
    number?: number;
  };
};

function formatFilters(filterObj: Record<string, unknown>, filterName = 'where') {
  const formattedFilter: Record<string, string | number | boolean> = {};
  Object.keys(filterObj).forEach((key: string) => {
    if (filterObj[key] !== null && filterObj[key] !== undefined && filterObj[key] !== '') {
      // @ts-ignore undefined are filtered out
      formattedFilter[`${filterName}[${key}]`] = filterObj[key];
    }
  });
  return formattedFilter;
}

function getQuery(path: string, { ...params }: APIQueryParamsType = {}) {
  if (!params.ignoreActive) {
    if (params.filter) {
      params.filter['active:eq'] = params.filter['active:eq'] !== false;
    } else {
      params.filter = { 'active:eq': true };
    }
  }

  let query = /\?/.test(path) ? `${path}&` : `${path}?`;

  if (params.filter) {
    query = `${query}${buildQueryString(formatFilters(params.filter))}`;
  }

  if (params.modifier) {
    query = `${query}&${buildQueryString(formatFilters(params.modifier, 'modifier'))}`;
  }

  if (params.include) {
    const includeQuery = { include: `[${params.include.join(',')}]` };
    query = `${query}&${buildQueryString(includeQuery)}`;
  }

  if (params.includeFields) {
    const includeFieldsQuery = {
      includeFields: `[${Object.keys(params.includeFields)
        .map((table) => `${table}:${params.includeFields?.[table].join(',')}`)
        .join(';')}]`,
    };
    query = `${query}&${buildQueryString(includeFieldsQuery)}`;
  }

  if (params.page) {
    const number = params.page.number === undefined ? 0 : params.page.number;
    const size = params.page.size === undefined ? 10 : params.page.size;
    query = `${query}&page[number]=${number}&page[size]=${size}`;
  }

  if (params.sort) {
    const sortQuery = { sort: params.sort };
    query = `${query}&${buildQueryString(sortQuery)}`;
  }

  if (params.folder_name || params.file_name || params.file_type || params.bucket_name) {
    query = `${query}&folder_name=${params.folder_name || ''}&file_name=${
      params.file_name || ''
    }&file_type=${params.file_type || ''}&bucket_name=${params.bucket_name || ''}`;
  }

  query = query.replace(/\?&/, '?');

  return query;
}

export default getQuery;
