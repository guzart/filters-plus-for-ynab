import isEmpty from 'lodash/isEmpty'
import { useEffect, useState } from 'react'

import Button from './components/atoms/button/Button'
import BudgetSelect from './components/molecules/budget-select/BudgetSelect'
import Client from './lib/ynab-api/client'
import './App.scss'

const CLIENT_ID =
  '71591f4ec6dae7f1ff9a3b58f5a33064478f1b56f3e5a1642352292580bc88a3'

const redirectUrl = 'http://localhost:3000/'
const authorizationUrl = `https://app.youneedabudget.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}&response_type=token`
const client = new Client()

function App() {
  const [accessToken, setAccessToken] = useState('')

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && !isEmpty(accessToken)) {
      client.updateAccessToken(accessToken)
      client
        .getUserInfo()
        .then(() => {
          setAccessToken(accessToken)
        })
        .catch((_err) => {
          localStorage.removeItem('accessToken')
          setAccessToken('')
        })
    } else {
      const hash = window.location.hash.replace('#', '')
      const params = new URLSearchParams(hash)
      const accessTokenParam = params.get('access_token')
      if (accessTokenParam) {
        localStorage.setItem('accessToken', accessTokenParam)
        window.location.href = redirectUrl
      }
    }
  }, [accessToken])

  const [activeBudgetId, setActiveBudgetId] = useState('')

  useEffect(() => {
    const budgetId = localStorage.getItem('activeBudgetId')
    if (budgetId && !isEmpty(budgetId)) {
      setActiveBudgetId(budgetId)
    } else if (!isEmpty(activeBudgetId)) {
      localStorage.setItem('activeBudgetId', activeBudgetId)
    }
  }, [activeBudgetId])

  if (isEmpty(accessToken)) {
    return (
      <div className="app-authorize">
        <Button href={authorizationUrl}>Connect with YNAB</Button>
      </div>
    )
  }

  if (isEmpty(activeBudgetId)) {
    return (
      <div className="app-budgets">
        <BudgetSelect
          client={client}
          onSelect={(budgetId: string) => setActiveBudgetId(budgetId)}
        />
      </div>
    )
  }

  return <div className="app">{activeBudgetId}</div>
}

export default App
