import Settings from './Settings'
import { ChangeEvent, FormEvent, useState } from 'react'
import {
  useAddAssets,
  useDeleteAssetById,
  useGetAssets,
} from '../hooks/useAssets'
import { AssetData } from '../../models/assets'
import { useAuth0 } from '@auth0/auth0-react'
import { useUsers } from '../hooks/useUsers'
import { useQueryClient } from '@tanstack/react-query'

const emptyForm = {
  id: '',
  ticker: '',
  name: '',
  shares: '',
  userId: '',
} as unknown as AssetData

const ws = new WebSocket('http://localhost:3000')

ws.onopen = () => {
  console.log('Websocket Connected')
}

ws.onclose = () => {}

ws.onerror = (error) => {
  console.error('WebSocket error:', error)
}

export default function AdjustHoldings() {
  const queryClient = useQueryClient()
  const [formState, setFormState] = useState(emptyForm)
  const addAssets = useAddAssets()
  const { getAccessTokenSilently } = useAuth0()
  const getMe = useUsers()
  const userId = getMe.data?.id as number
  const userAssets = useGetAssets(userId)
  const delteAssetById = useDeleteAssetById()

  if (getMe.isPending) {
    return <div className='app2'></div>
  }
  if (getMe.isError) {
    return <p>User data Error...</p>
  }

  if (userAssets.isPending) {
    return
  }
  if (userAssets.isError) {
    return <p>Asset data Error...</p>
  }

  const userAssetData = userAssets.data

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
      userId: (formState.userId = myId as number),
    } as unknown as AssetData
    await addAssets.mutateAsync({ newAsset, token })
    setFormState(emptyForm)
  }

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.currentTarget

    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleDelete = async (id: number) => {
    try {
      const token = await getAccessTokenSilently()

      await delteAssetById.mutateAsync({ id, token })

    } catch (error) {
      console.log(error)
    }
  }


  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'database_change') {
      queryClient.invalidateQueries({ queryKey: ['addAssets'] })
      queryClient.invalidateQueries({ queryKey: ['getAssetsByUserId'] })
    }
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
                  placeholder="BTC"
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
                  placeholder="BitCoin"
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
            {userAssetData.map((asset: AssetData) => {
              return (
                <div className="user-assets-wrapper" key={asset.id}>
                  <h1 className="user-assets-name">{asset.name}</h1>
                  <p className="user-assets-ticker">{asset.ticker}</p>
                  <p className="user-assets-shares">Shares: {asset.shares}</p>
                  <button onClick={() => handleDelete(asset.id)} className="user-asset-delete">Delete</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
