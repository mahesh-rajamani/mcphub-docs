import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/overview',
        'getting-started/quick-install',
        'getting-started/first-mcp',
      ],
    },
    {
      type: 'category',
      label: 'Creating MCPs',
      items: [
        {
          type: 'category',
          label: 'Import Methods',
          items: [
            'creating-mcps/import/openapi',
            'creating-mcps/import/grpc',
            'creating-mcps/import/manual-rest',
            'creating-mcps/import/custom-code',
          ],
        },
        'creating-mcps/variables/overview',
        'creating-mcps/manual-configuration',
        'creating-mcps/authentication',
      ],
    },
    {
      type: 'category',
      label: 'MCP Configuration Management',
      items: [
        'creating-mcps/settings-widget',
        'creating-mcps/export-import-config',
        'creating-mcps/versioning-merge',
        'creating-mcps/deployment-management',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/langchain-integration',
        'advanced/storage-encryption',
        'advanced/admin-api-direct',
      ],
    },
  ],
};

export default sidebars;