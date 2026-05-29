import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <span className="text-6xl">✓</span>
        <h1 className="mt-6 text-4xl font-bold">You're on the list.</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          We're generating your personalized marketing diagnostic. Expect a link in your inbox
          within minutes.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="outline">← Back to home</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
