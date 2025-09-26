import Settings from './Settings'

export default function AdjustHoldings() {

  
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
                  className="adjust-stocksandetfs-input"
                />
                Stocks and ETFs
              </label>
              <label className="adjust-asset-name-form-label">
                Input the name of the asset
                <input
                  type="text"
                  name=""
                  value=""
                  className="adjust-name-input"
                  placeholder="BTC"
                />
              </label>
              <label className="adjust-shares-form-label">
                Input the amount of shares
                <input
                  type="text"
                  name="shares"
                  value=""
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
