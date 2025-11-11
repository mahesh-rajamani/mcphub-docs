import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Visual MCP Design',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Create MCP servers visually without writing code. Import from OpenAPI, gRPC,
        or design manually with our intuitive interface.
      </>
    ),
  },
  {
    title: 'Live Testing',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Test your MCPs with real API calls. Validate endpoints, parameters,
        and responses in real-time with comprehensive testing tools.
      </>
    ),
  },
  {
    title: 'AI-Powered',
    Svg: require('@site/static/img/undraw_docusaurus_ai.svg').default,
    description: (
      <>
        Get intelligent suggestions and automated improvements.
        Built-in integration with OpenAI and custom AI providers.
      </>
    ),
  },
  {
    title: 'Production Ready',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Deploy to Docker, Kubernetes, or cloud platforms with one click.
        Multi-tenant architecture with enterprise-grade security.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}