export const buildStrategies = () => [
  {
    name: 'high_score',
    apply: (q: any) => q.order('score', { ascending: false }).gt('score', 7.5),
  },
  {
    name: 'popular',
    apply: (q: any) =>
      q.order('members', { ascending: false }).gt('members', 50000),
  },
  {
    name: 'recent',
    apply: (q: any) => q.order('year', { ascending: false }).gt('year', 2020),
  },
  {
    name: 'hidden_gems',
    apply: (q: any) =>
      q
        .order('score', { ascending: false })
        .lt('members', 30000)
        .gt('score', 7.0),
  },
]
