const KKPHIM_BASE_URL = 'https://phimapi.com';

/**
 * Fetch phim mới cập nhật (default page = 1)
 */
export const fetchLatestMovies = async (page: number = 1) => {
  const response = await fetch(`${KKPHIM_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch latest movies');
  const data = await response.json();
  return data.items || [];
};

/**
 * Fetch chi tiết phim (kèm danh sách tập phim)
 */
export const fetchMovieDetails = async (slug: string) => {
  const response = await fetch(`${KKPHIM_BASE_URL}/phim/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch movie details');
  const data = await response.json();
  return data.movie || data;
};

/**
 * Fetch danh sách tập phim
 */
export const fetchMovieVideos = async (slug: string) => {
  const response = await fetch(`${KKPHIM_BASE_URL}/phim/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch movie videos');
  const data = await response.json();
  return data?.episodes?.[0]?.server_data || [];
};


/**
 * Tìm kiếm phim nâng cao với nhiều tham số
 */
export const searchMovies = async ({
  keyword,
  page = 1,
  sort_field = '',
  sort_type = '',
  sort_lang = '',
  category = '',
  country = '',
  year = '',
  limit = '',
}: {
  keyword: string;
  page?: number;
  sort_field?: string;
  sort_type?: string;
  sort_lang?: string;
  category?: string;
  country?: string;
  year?: string;
  limit?: string;
}) => {
  const params = new URLSearchParams({
    keyword,
    page: page.toString(),
    sort_field,
    sort_type,
    sort_lang,
    category,
    country,
    year,
    limit,
  });

  const url = `${KKPHIM_BASE_URL}/v1/api/tim-kiem?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to search movies');
  const data = await response.json();
  return data?.data?.items || [];
};

/**
 * Fetch danh sách phim theo kiểu (vd: phim-le, phim-bo,...)
 */
export const fetchMovieListByType = async ({
  type_list,
  page = 1,
  sort_field = '',
  sort_type = '',
  sort_lang = '',
  category = '',
  country = '',
  year = '',
  limit = '',
}: {
  type_list: string;
  page?: number;
  sort_field?: string;
  sort_type?: string;
  sort_lang?: string;
  category?: string;
  country?: string;
  year?: string;
  limit?: string;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    sort_field,
    sort_type,
    sort_lang,
    category,
    country,
    year,
    limit,
  });

  const url = `${KKPHIM_BASE_URL}/v1/api/danh-sach/${type_list}?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch movies by type');
  const data = await response.json();
  return data?.data?.items || [];
};

/**
 * Get all genres
 */
export const fetchGenres = async () => {
  const response = await fetch(`${KKPHIM_BASE_URL}/the-loai`);
  if (!response.ok) throw new Error('Failed to fetch genres');
  const data = await response.json();
  return data || [];
};

/**
 * Get all countries
 */
export const fetchCountries = async () => {
  const response = await fetch(`${KKPHIM_BASE_URL}/quoc-gia`);
  if (!response.ok) throw new Error('Failed to fetch countries');
  const data = await response.json();
  return data || [];
};

/**
 * Get movies by year
 */
export const fetchMoviesByYear = async ({
  type_list,
  year,
  page = 1,
  sort_field = '',
  sort_type = '',
  sort_lang = '',
  category = '',
  country = '',
  limit = '',
}: {
  type_list: string;
  year: string;
  page?: number;
  sort_field?: string;
  sort_type?: string;
  sort_lang?: string;
  category?: string;
  country?: string;
  limit?: string;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    sort_field,
    sort_type,
    sort_lang,
    category,
    country,
    limit,
  });

  const url = `${KKPHIM_BASE_URL}/v1/api/nam/${type_list}?${params.toString()}&year=${year}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch movies by year');
  const data = await response.json();
  return data?.data?.items || [];
};
