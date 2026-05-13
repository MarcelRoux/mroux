import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from 'astro/loaders';

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

const ideas = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/ideas' }),
    schema: z.object({
        title: z.string(),
        status: z.enum(["idea", "researching", "draft", "published", "archived"]).default("idea"),
        created: z.coerce.date(),
        updated: z.coerce.date().optional(),
        slug: z.string(),
        summary: z.string(),
        publish_priority: z.enum(["low", "medium", "high"]).default("medium"),
        estimated_effort: z.enum(["small", "medium", "large"]).default("medium"),
        related_articles: z.array(z.string()).default([]),
        related_projects: z.array(z.string()).default([]),
        canonical_topics: z.array(z.string()).default([]),
        tags: z.array(z.string()).default([]),
        potential_sections: z.array(z.string()).default([]),
        key_questions: z.array(z.string()).default([]),
        hypotheses: z.array(z.string()).default([]),
        references: z.array(z.string()).default([]),
        artifacts: z.object({
            commands: z.array(z.string()).default([]),
            datasets: z.array(z.string()).default([]),
            diagrams: z.array(z.string()).default([]),
            screenshots: z.array(z.string()).default([]),
        }).default({
            commands: [],
            datasets: [],
            diagrams: [],
            screenshots: [],
        }),
        future_expansio: z.array(z.string()).default([]),
    })
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

export const collections = {
    benchmarks,
    blog,
    ideas,
    projects,
    systems,
};