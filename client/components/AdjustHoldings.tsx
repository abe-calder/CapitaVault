import Settings from './Settings'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAddAssets } from '../hooks/useAssets'
import { AssetData } from '../../models/assets'
import { useAuth0 } from '@auth0/auth0-react'
import { useUsers } from '../hooks/useUsers'

const emptyForm = {
  id: '',
  ticker: '',
  name: '',
  shares: '',
  userId: ''
} as unknown as AssetData

export default function AdjustHoldings() {
  const [formState, setFormState] = useState(emptyForm)
  const addAssets = useAddAssets()
  const { getAccessTokenSilently } = useAuth0()
  const getMe = useUsers()


  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    const token = await getAccessTokenSilently()
    const myId = getMe.data && getMe.data.id

    if (addAssets.isPending) {
      return
    }

    const newAsset = {
      ticker: formState.ticker as string,
      name: formState.name as string,
      shares: formState.shares as number,
      userId: formState.userId = myId as number
    } as unknown as AssetData 
    await addAssets.mutateAsync({ newAsset, token })
    setFormState(emptyForm)

  }

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.currentTarget

    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <Settings />
      <div className="adjust-holdings-wrapper">
        <div className="adjust-holdings">
          <h1 className="adjust-holdings-heading">Adjust Your Holdings Here</h1>
          <div className="adjust-holdings-form">
            <form onSubmit={handleSubmit}>
              <label className="adjust-ticker-form-label">
                Input the ticker tag for the asset
                <input
                  type="text"
                  name="ticker"
                  id="ticker"
                  value={formState.ticker}
                  className="adjust-ticker-input"
                  placeholder="Ticker"
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="adjust-asset-name-form-label">
                Input the name of the asset
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formState.name}
                  className="adjust-name-input"
                  placeholder="BTC"
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="adjust-shares-form-label">
                Input the amount of shares
                <input
                  type="number"
                  name="shares"
                  value={formState.shares}
                  className="adjust-shares-input"
                  placeholder="0.23447"
                  onChange={handleChange}
                  required
                />
              </label>
              <button
                data-pending={addAssets.isPending}
                className="adjust-form-submit-button"
              >
                Submit
              </button>
            </form>
          </div>
          <div className="display-holdings">
            <h1 className="current-holdings-heading">Current Holdings</h1>
          </div>
        </div>
      </div>
    </>
  )
}
