import { createFileRoute } from '@tanstack/react-router'
import { RootComponent } from '../components/ui/RootComponent'
export const Route = createFileRoute('/about')({
  component: RootComponent,
})


