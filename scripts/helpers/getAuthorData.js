export const getAuthorData = async () => {
  const authorName = document.head.querySelector("meta[name='author']")?.content;
  const resp = await fetch("/query-index.json?sheet=authors");

  if (resp.ok) {
    const json = await resp.json();
    const allAuthors = json.data;
    const [authorData] = allAuthors.filter((author) => author.title === authorName);

    return authorData;
  };

  return null;
};
