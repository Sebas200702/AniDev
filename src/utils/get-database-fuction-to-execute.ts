import { OrderFunctions } from 'types'

export const getFunctionToExecute = (
  orderby: string,
  orderDirection: string
) => {
  if (orderby === 'score') {
    return orderDirection === 'asc'
      ? OrderFunctions.score_asc
      : OrderFunctions.score
  }
  if (orderby === 'title') {
    return orderDirection === 'asc'
      ? OrderFunctions.title_asc
      : OrderFunctions.title
  }
  return OrderFunctions.score
}
