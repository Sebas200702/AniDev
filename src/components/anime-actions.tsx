interface Action {
  name: string
  url: string
}
import '@styles/buttons.css'

export const AnimeActions = ({ actions }: { actions: Action[] }) => {
  return (
    <ul>
      {actions.map((action, index) => (
        <li key={action.name}>
          <a
            href={action.url}
            className={index % 2 === 0 ? 'button-primary' : 'button-secondary'}
          >
            {action.name}
          </a>
        </li>
      ))}
    </ul>
  )
}
