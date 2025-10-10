import { createContext, useContext, ReactNode, useMemo, useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { useGetAssets } from '../hooks/useAssets'
import { usePolygonDataContext } from './PolygonDataContext'
import { useFxRatesContext } from './FxRatesContext'
import { AssetData } from '../../models/assets'
import { Results } from '../../models/polygon'

interface PortfolioState {
  totalBalance: number
  totalCost: number
  income: number
  totalBalanceUsd: number
  pieChartData: { name: string; value: number }[]
  convertCurrency: string
  setConvertCurrency: (currency: string) => void
  isLoading: boolean
  error: string | null
}

const PortfolioContext = createContext<PortfolioState | undefined>(undefined)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const getMe = useUsers()
  const userId = getMe.data?.id

  // @ts-expect-error enabled !!userId is the only option
  const { data: userAssetData = [] } = useGetAssets(userId, {
    enabled: !!userId,
  },)

  const {
    rates: fxRates,
    isLoading: isFxLoading,
    error: fxError,
  } = useFxRatesContext()
  const {
    polygonData,
    isLoading: isFxLoading,
    error: fxError,
  } = useFxRatesContext()


}
