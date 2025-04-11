import { EntityStorageKeys, FilterStorageKeys } from '../constants'

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
  default: T
}

export function loadFilter<T, K extends FilterStorageKeys = FilterStorageKeys>(
  storageKey: K,
  props: LoadSettingProps<T>,
): () => T {
  return () => {
    const storedValue = localStorage.getItem(storageKey)
    if (storedValue) {
      const data = JSON.parse(storedValue)
      if (props.default && props.default instanceof Set) {
        return new Set(data)
      }

      return data ? data : props.default
    }

    return props.default
  }
}

export function saveFilter<T, K extends FilterStorageKeys = FilterStorageKeys>(storageKey: K, value: T) {
  if (value) {
    localStorage.setItem(storageKey, JSON.stringify(value))
  } else {
    localStorage.removeItem(storageKey)
  }
}

export const loadStringSetFilter = (storageKey: FilterStorageKeys) =>
  loadFilter(storageKey, { default: new Set([] as string[]) })

export const loadNullableDateFilter = (storageKey: FilterStorageKeys) =>
  loadFilter<Date | null>(storageKey, { default: null })
