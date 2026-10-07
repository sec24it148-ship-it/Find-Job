import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Categories, Footer, ForEmployers, HowItWorks, Stats } from '@/components/landing/Sections'

export default function Landing() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Categories />
        <HowItWorks />
        <ForEmployers />
      </main>
      <Footer />
    </div>
  )
}
