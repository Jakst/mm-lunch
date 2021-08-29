import type { NextPage } from 'next'
import Head from 'next/head'
import { appInfo } from '../lib/app-info'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>{appInfo.name}</title>
				<meta name="description" content={appInfo.description} />
				<link
					rel="icon"
					href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍲</text></svg>"
				/>
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
					{appInfo.name}{' '}
					<a href={appInfo.latest.binary}>v{appInfo.latest.version}</a>
				</h1>

				<p className={styles.description}>{appInfo.description}</p>
			</main>
		</>
	)
}

export default Home
