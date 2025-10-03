import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import TickerTest from './TickerTest'
import * as polygonApi from '../../apis/polygon.ts'

// Mock data to return from getAssetDataByTicker
const mockData = [
  {
    ticker: 'BTC',
    results: [{ c: 50000 }],
  },
  {
    ticker: 'ETH',
    results: [{ c: 3000 }],
  },
  {
    ticker: 'AAPL',
    results: [{ c: 200 }],
  },
  {
    ticker: 'TSLA',
    results: [{ c: 700 }],
  },
  {
    ticker: 'SOLNZD',
    results: [],
  },
]

// Mock the API call
vi.spyOn(polygonApi, 'default').mockImplementation(async () => mockData)

describe('TickerTest', () => {
  it('renders ticker values and handles missing data', async () => {
    render(<TickerTest />)

    // Wait for the loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading test tickers/i)).not.toBeInTheDocument()
    })

    // Check for rendered tickers and values
    expect(screen.getByText(/Bitcoin \(X:BTCUSD\)/)).toBeInTheDocument()
    expect(screen.getByText(/Ethereum \(X:ETHUSD\)/)).toBeInTheDocument()
    expect(screen.getByText(/Apple \(AAPL\)/)).toBeInTheDocument()
    expect(screen.getByText(/Tesla \(TSLA\)/)).toBeInTheDocument()
    expect(screen.getByText(/Solana \(X:SOLNZD\)/)).toBeInTheDocument()

    // Check for calculated values
    expect(screen.getByText(/Value: \$50000.00/)).toBeInTheDocument()
    expect(screen.getByText(/Value: \$6000.00/)).toBeInTheDocument()
    expect(screen.getByText(/Value: \$600.00/)).toBeInTheDocument()
    expect(screen.getByText(/Value: \$2800.00/)).toBeInTheDocument()

    // Check for "No data" on empty results
    expect(screen.getByText(/No data/)).toBeInTheDocument()
  })
})