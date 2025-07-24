// Do not import fs, path, or gray-matter at the top level!

export function getPostSlugs() {
  const fs = require('fs');
  const path = require('path');
  const postsDirectory = path.join(process.cwd(), "_posts");
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug, fields = []) {
  const fs = require('fs');
  const path = require('path');
  const matter = require('gray-matter');
  const realSlug = slug.replace(/\.md$/, "");
  const postsDirectory = path.join(process.cwd(), "_posts");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items = {};
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });
  return items;
}

export function getAllPosts(fields = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
