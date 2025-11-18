import { LoadingCard } from '@search/components/search-results/loading-card'
import type { Section } from '@shared/types'
import { ListLayout } from '@user/components/user-dashboard/list-layout'

interface LoadingStateProps {
  sections: Section[]
  setUserList: (sections: Section[]) => void
}

export const LoadingState = ({ sections, setUserList }: LoadingStateProps) => (
  <ListLayout sections={sections} setUserList={setUserList}>
    {Array.from({ length: 6 }).map((_, index) => (
      <LoadingCard key={index + 1} />
    ))}
  </ListLayout>
)
