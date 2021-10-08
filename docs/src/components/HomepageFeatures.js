import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: '新手友好',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: <>零配置快速搭建中后台应用</>,
  },
  {
    title: '专注中后台开发',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: <>提供配置模式路由，状态管理等，助力中后台开发</>,
  },
  {
    title: '基于 Vite',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: <>享受 Vite 带来的速度与效率的提升</>,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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
