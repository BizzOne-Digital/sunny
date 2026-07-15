import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogDetail } from "@/components/site";
import { BlogPost, blogPosts, getCollection } from "@/lib/site";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getCollection<BlogPost>("blog", blogPosts);
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage.url],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getCollection<BlogPost>("blog", blogPosts);
  const post = posts.find((item) => item.slug === slug && item.status !== "draft");
  if (!post) notFound();

  return <BlogDetail post={post} related={posts.filter((item) => item.slug !== post.slug).slice(0, 2)} />;
}
