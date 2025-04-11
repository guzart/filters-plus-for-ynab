import { EntityStorageKeys, SettingStorageKeys } from '../constants'

interface FetchEntityProps<K extends EntityStorageKeys, T> {
  storageKey: K
  request: () => Promise<T>
  setState: (state: T | null) => void
  isLoading: Record<K, boolean>
  setIsLoading: (isLoading: Record<K, boolean>) => void
}

export function fetchEntities<K extends EntityStorageKeys, T>({
  storageKey,
  request,
  setState,
  isLoading,
  setIsLoading,
}: FetchEntityProps<K, T>) {
  const storedEntity = localStorage.getItem(storageKey)
  if (storedEntity) {
    setState(JSON.parse(storedEntity))
  } else if (!isLoading[storageKey]) {
    setIsLoading({ ...isLoading, [storageKey]: true })
    request().then((data) => {
      setState(data)
      localStorage.setItem(storageKey, JSON.stringify(data))
      setIsLoading({ ...isLoading, [storageKey]: false })
    })
  }
}

interface LoadSettingProps<T> {
  defaultValue: T
}

export function loadSetting<T, K extends SettingStorageKeys = SettingStorageKeys>(
  storageKey: K,
  { defaultValue }: LoadSettingProps<T>,
): () => T {
  return () => {
    const storedValue = localStorage.getItem(storageKey)
    if (storedValue) {
      return JSON.parse(storedValue)
    }

    return defaultValue
  }
}
