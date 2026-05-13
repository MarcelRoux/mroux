import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        status: z.enum(["draft", "published", "archived"]).default("draft"),
        tags: z.array(z.string()).default([]),
        slug: z.string()
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        status: z.enum(["active", "paused", "complete", "archived"]),
        featured: z.boolean().default(false),
        started: z.coerce.date().optional(),
        updated: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        repo_url: z.url().optional(),
        external_url: z.url().optional(),
        slug: z.string(),
    }),
});

const systems = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/systems' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        slug: z.string(),
    }),
});

const benchmarks = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/benchmarks' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        status: z.enum(["draft", "published", "archived"]).default("draft"),
        tags: z.array(z.string()).default([]),
        slug: z.string(),
        metrics: z.array(
            z.object({
                name: z.string(),
                value: z.string()
            })
        )
            .default([])
    }),
});

export const collections = {
    blog,
    projects,
    systems,
    benchmarks
};