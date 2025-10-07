import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import {
  useAddAssets,
  useDeleteAssetById,
  useGetAssets,
} from '../hooks/useAssets'
import { AssetData } from '../../models/assets'
import { useAuth0 } from '@auth0/auth0-react'
import { useUsers } from '../hooks/useUsers'
import { useQueryClient } from '@tanstack/react-query'
import Nav from './Nav'

interface FormState {
  ticker: ''
  name: ''
  shares: ''
  cost: ''
}

const emptyForm: FormState = {
  ticker: '',
  name: '',
  shares: '',
  cost: '',
}

export default function AdjustHoldings() {
  const queryClient = useQueryClient()
  const [formState, setFormState] = useState(emptyForm)
  const addAssets = useAddAssets()
  const { getAccessTokenSilently } = useAuth0()
  const getMe = useUsers() // This line is moved up

  const userId = getMe.data?.id
  const delteAssetById = useDeleteAssetById()

  useEffect(() => {
    const ws = new WebSocket('http://localhost:3000')

    ws.onopen = () => {
      console.log('Websocket Connected')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'database_change') {
        queryClient.invalidateQueries({ queryKey: ['addAssets'] })
        queryClient.invalidateQueries({ queryKey: ['getAssetsByUserId'] })
      }
    }

    ws.onclose = () => {
      console.log('WebSocket Disconnected')
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => ws.close()
  }, [queryClient])

  // @ts-expect-error enabled only when userId
  const { data: userAssetData = [] } = useGetAssets(userId, {
    enabled: !!userId,
  })

  if (getMe.isPending) {
    return <div className="app2"></div>
  }
  if (getMe.isError) {
    return <p>User data Error...</p>
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault()
    const token = await getAccessTokenSilently()

    if (addAssets.isPending) {
      return
    }

    const newAsset = {
      ticker: formState.ticker,
      name: formState.name,
      shares: Number(formState.shares),
      userId: userId as number,
      cost: formState.cost,
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

  return (
    <>
      <div className='app2'>
        <Nav />
        <div className="adjust-holdings-wrapper">
          <div className="adjust-holdings">
            <h1 className="adjust-holdings-heading">
              Adjust Your Holdings Here
            </h1>
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
                <label className="adjust-cost-form-label">
                  Input the cost of the shares when you bought them
                  <input
                    type="text"
                    name="cost"
                    value={formState.cost}
                    className="adjust-cost-input"
                    placeholder="10,000NZD"
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
                    <p className="user-asset-cost">Cost: {asset.cost}</p>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="user-asset-delete"
                    >
                      Delete
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
