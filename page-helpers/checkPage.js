const normalizePathname = () => {
  const pathname = window.location.pathname;
  
  // Remove the trailing slash
  return pathname.replace(/\/$/, "");
}

export const checkPage = (path) => {
  const normalizedPathname = normalizePathname();
  
  // The path "/ideas/" is the Ideas index page, so the normalized pathname will result in "/ideas"
  return normalizedPathname === path;
}

export const checkSubPage = (path) => {
  const normalizedPathname = normalizePathname();
  
  // The path "/ideas/article-name" is a sub-page of Ideas, so the normalized pathname should start with "/ideas/"
  return normalizedPathname.startsWith(path);
}
