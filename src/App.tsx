import { useEffect, useLayoutEffect, useState } from 'react'
import { Container, Link, Theme } from '@radix-ui/themes'

import BudgetSelect from './components/molecules/budget-select/BudgetSelect'
import Transactions from './components/pages/transactions/Transactions'
import Client from './lib/ynab-api/client'
import { buildAuthorizationUrl } from './lib/helpers/ynab'
import { CLIENT_ID, ACCESS_TOKEN_KEY, ACTIVE_BUDGET_ID_KEY } from './lib/constants'

const redirectUrl = window.location.origin + window.location.pathname
const authorizationUrl = buildAuthorizationUrl({ clientId: CLIENT_ID, redirectUrl })

function getAccessTokenFromLocationHash() {
  const hash = window.location.hash.replace('#', '')
  const params = new URLSearchParams(hash)
  const accessTokenParam = params.get('access_token')
  return accessTokenParam
}

function clearLocationHash() {
  window.location.hash = ''
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(null as string | null)
  const [activeBudgetId, setActiveBudgetId] = useState(null as string | null)
  const [client, setClient] = useState(null as Client | null)

  useLayoutEffect(() => {
    if (!isLoading) {
      return
    }

    let accessToken: string | null = null

    const accessTokenParam = getAccessTokenFromLocationHash()
    if (accessTokenParam) {
      accessToken = accessTokenParam
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      clearLocationHash()
    }

    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (storedToken) {
      accessToken = storedToken
    }

    if (accessToken) {
      setAccessToken(accessToken)
      setClient(new Client(accessToken))
    }

    const storedActiveBudgetId = localStorage.getItem(ACTIVE_BUDGET_ID_KEY)
    if (storedActiveBudgetId) {
      setActiveBudgetId(storedActiveBudgetId)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (activeBudgetId) {
      localStorage.setItem(ACTIVE_BUDGET_ID_KEY, activeBudgetId)
    }
  }, [activeBudgetId])

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (!accessToken) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Link href={authorizationUrl}>Connect with YNAB</Link>
        </div>
      )
    }

    if (!client) {
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      )
    }

    if (!activeBudgetId) {
      return (
        <div className="flex h-screen items-center justify-center">
          <BudgetSelect client={client} onSelect={(budgetId: string) => setActiveBudgetId(budgetId)} />
        </div>
      )
    }

    return (
      <div>
        <Transactions budgetId={activeBudgetId} client={client} />
      </div>
    )
  }

  return (
    <Theme>
      <Container>{renderContent()}</Container>
    </Theme>
  )
}

export default App
