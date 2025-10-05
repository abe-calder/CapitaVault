import request from 'superagent'
import { ConvertPost } from '../../models/fxrates'

const rootURL = new URL(`/api/v1`, document.baseURI)

export default async function getConversionRate({
  from,
  to,
  amount
}: ConvertPost) {
  const response = await request.get(
    `${rootURL}/fxrates/${from}/${to}/${amount}`,
  )
  return response.body
}