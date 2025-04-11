import { useEffect, useState } from 'react'
import { Container, Link, Theme } from '@radix-ui/themes'

import BudgetSelect from './components/molecules/budget-select/BudgetSelect'
import Transactions from './components/pages/transactions/Transactions'
import Client from './lib/ynab-api/client'
import './App.scss'

const ACCESS_TOKEN_KEY = 'fp__accessToken'
const ACTIVE_BUDGET_ID_KEY = 'fp__activeBudgetId'

const CLIENT_ID = '71591f4ec6dae7f1ff9a3b58f5a33064478f1b56f3e5a1642352292580bc88a3'

const redirectUrl = window.location.origin + window.location.pathname
const authorizationUrl = `https://app.ynab.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=token`
const client = new Client()

function App() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [accessToken, setAccessToken] = useState(null as string | null)
  const [activeBudgetId, setActiveBudgetId] = useState(null as string | null)

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (storedToken) {
      client.updateAccessToken(storedToken)
      client
        .getUserInfo()
        .then(() => {
          setAccessToken(storedToken)
        })
        .catch((_err) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          setAccessToken(null)
        })
        .finally(() => {
          setIsInitializing(false)
        })
    } else {
      const hash = window.location.hash.replace('#', '')
      const params = new URLSearchParams(hash)
      const accessTokenParam = params.get('access_token')
      if (accessTokenParam) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessTokenParam)
        window.location.href = redirectUrl
      }

      setIsInitializing(false)
    }
  }, [accessToken])

  useEffect(() => {
    const budgetId = localStorage.getItem(ACTIVE_BUDGET_ID_KEY)
    if (budgetId) {
      setActiveBudgetId(budgetId)
    } else if (activeBudgetId) {
      localStorage.setItem(ACTIVE_BUDGET_ID_KEY, activeBudgetId)
    }
  }, [activeBudgetId])

  const renderContent = () => {
    if (isInitializing) {
      return <div>Initializing...</div>
    }

    if (!accessToken) {
      return (
        <div className="text-center">
          <Link href={authorizationUrl}>Connect with YNAB</Link>
        </div>
      )
    }

    if (!activeBudgetId) {
      return (
        <div className="app-budgets">
          <BudgetSelect client={client} onSelect={(budgetId: string) => setActiveBudgetId(budgetId)} />
        </div>
      )
    }

    return (
      <div className="app-transactions">
        <Transactions budgetId={activeBudgetId} client={client} />
      </div>
    )
  }

  return (
    <Theme>
      <Container>
        {renderContent()}
      </Container>
    </Theme>
  )
}

export default App
