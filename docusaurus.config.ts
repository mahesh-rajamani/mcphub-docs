import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MCPHub',
  tagline: 'The Complete Platform for Model Context Protocol Development',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://mahesh-rajamani.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/mcphub-docs/',

  // GitHub pages deployment config
  organizationName: 'mahesh-rajamani',
  projectName: 'mcphub-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          editUrl: 'https://github.com/mahesh-rajamani/mcphub-docs/tree/main/',
          versions: {
            current: {
              label: 'Latest',
              path: 'latest',
            },
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/mahesh-rajamani/mcphub-docs/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/mcphub-social-card.png',
    navbar: {
      title: 'MCPHub',
      logo: {
        alt: 'MCPHub Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
        {
          href: 'https://github.com/mahesh-rajamani/mcphub',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Quick Start',
              to: '/docs/getting-started/quick-install',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/mahesh-rajamani/mcphub/discussions',
            },
            {
              label: 'Issues',
              href: 'https://github.com/mahesh-rajamani/mcphub/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/mahesh-rajamani/mcphub',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MCPHub. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json', 'protobuf'],
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'YOUR_APP_ID',
      // Public API key: it is safe to commit it
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'mcphub',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;