import { Result } from '../../models/polygon.ts'
import request from 'superagent'

export default async function getPolygon() {
  const response = await request.get(`api/v1/abe`)
  return response.body as Result
}
