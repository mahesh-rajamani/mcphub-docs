import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/mcphub-docs/search',
    component: ComponentCreator('/mcphub-docs/search', '0cb'),
    exact: true
  },
  {
    path: '/mcphub-docs/docs',
    component: ComponentCreator('/mcphub-docs/docs', 'c94'),
    routes: [
      {
        path: '/mcphub-docs/docs/latest',
        component: ComponentCreator('/mcphub-docs/docs/latest', 'd69'),
        routes: [
          {
            path: '/mcphub-docs/docs/latest',
            component: ComponentCreator('/mcphub-docs/docs/latest', 'bb8'),
            routes: [
              {
                path: '/mcphub-docs/docs/latest/advanced/admin-api-direct',
                component: ComponentCreator('/mcphub-docs/docs/latest/advanced/admin-api-direct', '337'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/advanced/header-forwarding',
                component: ComponentCreator('/mcphub-docs/docs/latest/advanced/header-forwarding', '514'),
                exact: true
              },
              {
                path: '/mcphub-docs/docs/latest/advanced/langchain-integration',
                component: ComponentCreator('/mcphub-docs/docs/latest/advanced/langchain-integration', 'd18'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/advanced/storage-encryption',
                component: ComponentCreator('/mcphub-docs/docs/latest/advanced/storage-encryption', 'b34'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/authentication',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/authentication', 'c98'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/deployment-management',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/deployment-management', '668'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/export-import-config',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/export-import-config', '96a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/import/custom-code',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/import/custom-code', 'bd9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/import/grpc',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/import/grpc', '38c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/import/manual-rest',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/import/manual-rest', 'f6e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/import/openapi',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/import/openapi', '19b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/manual-configuration',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/manual-configuration', 'b0c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/settings-widget',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/settings-widget', '034'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/variables/overview',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/variables/overview', '170'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/creating-mcps/versioning-merge',
                component: ComponentCreator('/mcphub-docs/docs/latest/creating-mcps/versioning-merge', 'd6f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/getting-started/first-mcp',
                component: ComponentCreator('/mcphub-docs/docs/latest/getting-started/first-mcp', '9bf'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/getting-started/overview',
                component: ComponentCreator('/mcphub-docs/docs/latest/getting-started/overview', '57a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/mcphub-docs/docs/latest/getting-started/quick-install',
                component: ComponentCreator('/mcphub-docs/docs/latest/getting-started/quick-install', '151'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/mcphub-docs/',
    component: ComponentCreator('/mcphub-docs/', 'cf3'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
