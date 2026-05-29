import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: '⚡',
    title: 'One-Click Stack Integration',
    description: 'Connects to HubSpot, Google Analytics, Meta Ads, Klaviyo, Salesforce, and 30+ tools via API in under 5 minutes.',
  },
  {
    icon: '📊',
    title: '7-Dimension Growth Score',
    description: 'Proprietary scoring algorithm rates each growth dimension on a 0–100 scale with benchmarks against industry peers.',
  },
  {
    icon: '🤖',
    title: 'AI-Generated Action Plan',
    description: 'Produces a prioritized 90-day roadmap with specific recommendations ranked by expected impact and effort.',
  },
  {
    icon: '📄',
    title: 'Executive Summary Report',
    description: 'Auto-generates a board-ready PDF with key findings, visualized scores, and strategic recommendations.',
  },
  {
    icon: '📡',
    title: 'Live Dashboard',
    description: 'Real-time monitoring of all 7 dimensions with alerts when performance dips below benchmarks.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold">
            Everything your marketing team needs to stop guessing
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            One platform. Seven dimensions. Zero spreadsheets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, description }) => (
            <Card key={title} className="hover:border-primary/40 transition-colors">
              <CardContent className="pt-6">
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
