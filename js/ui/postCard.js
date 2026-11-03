export function createPostCard(post) {
  const article = document.createElement("article");
  article.classList.add(
  "post-card",
  "card",
  "bg-white",
  "border-0",
  "shadow-sm",
  "text-break"
 );

const cardBody = document.createElement("div");
cardBody.classList.add("card-body", "p-4");

const heading = document.createElement("h2");
heading.classList.add("card-title", "h4");

const link = document.createElement("a");
link.classList.add("text-decoration-none");

  link.textContent = post.title || "Untitled post";
  link.href = `./post.html?id=${encodeURIComponent(post.id)}`;

  heading.append(link);

  const author = document.createElement("p");
  author.classList.add("post-author", "small", "text-body-secondary");

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
  excerpt.classList.add("card-text", "mb-0");
  const body = post.body || "";

  if (body.length > 160) {
    excerpt.textContent = body.slice(0, 160) + "...";
  } else {
    excerpt.textContent = body;
  }

  cardBody.append(heading, author, excerpt);
article.append(cardBody);

  return article;
}