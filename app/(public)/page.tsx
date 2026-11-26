import AboutSection from '../pages/home/about-section'
import HeroSection from '../pages/home/hero-section'
import ServicesSection from '../pages/home/services-section'
import DataImportanceSection from '../pages/home/data-importance-section'
import DifferentialsSection from '../pages/home/differentials-section'
import ArticlesSection from '../pages/home/articles-section'
import PortfolioSection from '../pages/home/portfolio-section'
import {
  getHomeContent,
  getAboutContent,
  getServices,
  getPublishedArticles,
  getPublishedPortfolio,
} from '@/lib/data'

export const revalidate = 60 // Revalida a cada 60s ou sob demanda via revalidatePath

export default async function Home() {
  const [homeData, aboutData, servicesData, articles, portfolio] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
    getServices(),
    getPublishedArticles(),
    getPublishedPortfolio(),
  ])

  return (
    <>
      <HeroSection initialData={homeData} />
      <AboutSection initialData={aboutData} />
      <ServicesSection initialData={servicesData} />
      <DataImportanceSection />
      <DifferentialsSection />
      {portfolio && portfolio.length > 0 && <PortfolioSection portfolio={portfolio} />}
      {articles && articles.length > 0 && <ArticlesSection articles={articles} />}
    </>
  )
}
