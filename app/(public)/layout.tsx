import { ReactNode } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import ContactForm from '../components/contact-form'
import ScrollProgress from '../components/scroll-progress'
import BackgroundEffects from '../components/background-effects'
import BackToTop from '../components/back-to-top'
import { getContactSettings, getSiteSettings } from '@/lib/data'

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [contactSettings, siteSettings] = await Promise.all([
    getContactSettings(),
    getSiteSettings(),
  ])

  return (
    <>
      <ScrollProgress />
      <BackgroundEffects />
      <Header />
      <main className="relative z-10">{children}</main>
      <ContactForm contactSettings={contactSettings} />
      <Footer contactSettings={contactSettings} siteSettings={siteSettings} />
      <BackToTop />
    </>
  )
}
