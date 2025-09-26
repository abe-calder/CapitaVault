import Settings from './Settings'
import { useState } from 'react'

export default function AdjustHoldings() {
  const [ formState, setFormState ] = useState()

  return (
    <>
      <Settings />
      <div className="adjust-holdings-wrapper">
        <div className="adjust-holdings">
          <h1 className="adjust-holdings-heading">Adjust Your Holdings Here</h1>
          <div className="adjust-holdings-form">
            <form>
              <label htmlFor="crypto" className="adjust-crypto-form-label">
                <input
                  type="radio"
                  name="stockorcrypto"
                  id="crypto"
                  value={formState}
                  className="adjust-crypto-input"
                />
                Crypto
              </label>
              <label
                htmlFor="stockorcrypto"
                className="adjust-stocks-form-label"
              >
                <input
                  type="radio"
                  name="stockorcrypto"
                  id="stocksandetfs"
                  value={formState}
                  className="adjust-stocksandetfs-input"
                />
                Stocks and ETFs
              </label>
              <label className="adjust-asset-name-form-label">
                Input the name of the asset
                <input
                  type="text"
                  name="name"
                  id='name'
                  value={formState}
                  className="adjust-name-input"
                  placeholder="BTC"
                />
              </label>
              <label className="adjust-shares-form-label">
                Input the amount of shares
                <input
                  type="number"
                  name="shares"
                  value={formState}
                  className="adjust-shares-input"
                  placeholder="0.23447"
                />
              </label>
              <button className="adjust-form-submit-button">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
