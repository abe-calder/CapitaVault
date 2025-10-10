import { useMemo, useState } from "react";
import { useFxRatesContext } from "../context/FxRatesContext";
import { usePolygonDataContext } from "../context/PolygonDataContext";
import Nav from "./Nav";
import TopRightProfile from "./TopRightProfile";
import { useGetAssets } from "../hooks/useAssets";
import { useUsers } from "../hooks/useUsers";

export default function Investments() {
  const getMe = useUsers()
  const userId = getMe.data?.id
  // @ts-expect-error enabled !!userId is the only option
  const { data: userAssetData = [] } = useGetAssets(userId, {
    enabled: !!userId,
  })
  const {
    rates: fxRates,
    isLoading: isFxLoading,
    error: fxError,
  } = useFxRatesContext()
  const {
    polygonData,
    isLoading: isPolygonLoading,
    error: polygonError,
  } = usePolygonDataContext()
  const [convertToCurrency, setConvertToCurrency] = useState('NZD') // state for user selection

 
  
  return (
    <>
      <div className="app2">
        <Nav />
        <TopRightProfile />
        <div className="investments-wrapper">
          <div className="investments-heading-overview-wrapper">
            <h1 className="investments-heading">Investments</h1>
            <div className="total-investments-wrapper">
              <img
                className="dollar-sign-icon"
                alt="dollar-sign-icon"
                src="/images/hand-and-dollar-sign-icon.webp"
              ></img>
              <h1 className="total-investments-heading">Total Invested</h1>
            </div>
            <div className="number-of-investments-wrapper">
              <img
                className="stack-of-coins-icon"
                alt="stack-of-coins-icon"
                src="/images/stack-of-coins-icon.webp"
              ></img>
              <h1 className="number-of-investments-heading">
                No. of Investments
              </h1>
            </div>
            <div className="rate-of-return-wrapper">
              <img
                className="rate-of-return-icon"
                alt="rate-of-return-icon"
                src="/images/rate-of-return-icon.webp"
              ></img>
              <h1 className="rate-of-return-heading">Rate of Return</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}