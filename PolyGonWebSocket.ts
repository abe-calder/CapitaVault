// import { websocketClient } from '@polygon.io/client-js'
// import 'dotenv/config'

// const apiKey = process.env.POLY_API_KEY || ''

// const stocksWS = websocketClient(apiKey, 'wss://delayed.polygon.io').stocks()

// interface PolygonResponse {
//   ev: string;
//   // Add other properties as needed based on the actual response structure
// }

// stocksWS.onmessage = ({ response }: { response: string }) => {
//   const [message] = JSON.parse(response) as PolygonResponse[];

//   stocksWS.send('{"action":"subscribe", "params":"AM.MSFT,A.MSFT"}')

//   switch (message.ev) {
//     case 'AM':
//       // your trade message handler
//       break
//     case 'A':
//       // your trade message handler
//       break
//   }
// }

// stocksWS.send({ action: 'subscribe', params: 'T.MSFT' })
