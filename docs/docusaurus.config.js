const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Viter',
  tagline: '小而美的 Vite 中后台开发框架',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ykfe', // Usually your GitHub org/user name.
  projectName: 'viter', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Viter',
      logo: {
        alt: 'Viter Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'guide/介绍',
          position: 'right',
          label: '指引',
        },
        // { to: '/blog', label: '博客', position: 'right' },
        {
          href: 'https://github.com/ykfe/viter',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '介绍',
              to: '/docs/guide/介绍',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'Issues',
              href: 'https://github.com/ykfe/viter/issues',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ykfe/viter',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Viter, Inc.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
