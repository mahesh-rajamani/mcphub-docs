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
            'creating-mcps/manual-configuration',
            'creating-mcps/import-methods',
            'creating-mcps/import/manual-rest',
          ],
        },
        'creating-mcps/variables/overview',
        'creating-mcps/authentication',
        'creating-mcps/content-type-definition',
        'creating-mcps/mcp-resources',
      ],
    },
    {
      type: 'category',
      label: 'MCP Configuration Management',
      items: [
        'creating-mcps/settings-widget',
        'creating-mcps/export-import-config',
        'creating-mcps/deployment-management',
        'creating-mcps/roles',
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/overview',
        'advanced/langchain-integration',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/storage-encryption',
      ],
    },
  ],
};

export default sidebars;