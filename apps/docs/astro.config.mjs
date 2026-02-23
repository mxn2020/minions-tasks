import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const isProd = process.env.BRANCH === 'main';
const isDev = process.env.BRANCH === 'dev';
const siteUrl = isProd ? 'https://tasks.minions.help' : (isDev ? 'https://tasks.minions.help' : 'http://localhost:4321');

export default defineConfig({
    site: siteUrl,
    integrations: [
        starlight({
            customCss: ['./src/styles/custom.css'],
            title: 'Minions Tasks',
            description: 'Task and work management across agents, humans, and workflows',
            defaultLocale: 'root',
            locales: {
                root: { label: 'English', lang: 'en' },
            },
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/mxn2020/minions-tasks' },
                { icon: 'external', label: 'App', href: 'https://tasks.minions.wtf' },
            ],
            sidebar: [
                {
                    label: 'Getting Started',
                    items: [
                        { label: 'Introduction', link: '/getting-started/introduction/' },
                        { label: 'Installation', link: '/getting-started/installation/' },
                        { label: 'Quick Start', link: '/getting-started/quick-start/' },
                    ],
                },
                {
                    label: 'Guides',
                    autogenerate: { directory: 'guides' },
                },
                {
                    label: 'API Reference',
                    items: [
                        { label: 'TypeScript', link: '/api/typescript/' },
                        { label: 'Python', link: '/api/python/' },
                    ],
                },
            ],
        }),
    ],
});
