export function createPostCard(post) {
  const article = document.createElement("article");
  article.classList.add("post-card");

  const heading = document.createElement("h2");
  const link = document.createElement("a");

  link.textContent = post.title || "Untitled post";
  link.href = `./post.html?id=${encodeURIComponent(post.id)}`;

  heading.append(link);

  const author = document.createElement("p");
  author.classList.add("post-author");

  if (post.author && post.author.name) {
    const authorLink = document.createElement("a");

    authorLink.textContent = post.author.name;
    authorLink.href =
      `./profile.html?name=${encodeURIComponent(post.author.name)}`;

    author.append("By ", authorLink);
  } else {
    author.textContent = "Unknown author";
  }

  const excerpt = document.createElement("p");
  const body = post.body || "";

  if (body.length > 160) {
    excerpt.textContent = body.slice(0, 160) + "...";
  } else {
    excerpt.textContent = body;
  }

  article.append(heading, author, excerpt);

  return article;
}