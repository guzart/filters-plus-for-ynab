import { EntityStorageKeys, ENTITIES_STORAGE_KEYS, FILTERS_STORAGE_KEYS, FilterStorageKeys } from '../constants'

interface FetchEntityProps<T> {
  request: () => Promise<T>
  setState: (state: T | null) => void
}

export async function fetchEntities<T>(keyName: EntityStorageKeys, { request, setState }: FetchEntityProps<T>) {
  const key = ENTITIES_STORAGE_KEYS[keyName]
  const storedData = localStorage.getItem(key)
  if (storedData) {
    setState(JSON.parse(storedData))
    return
  }

  const data = await request()
  setState(data)

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error storing entity data for ${key}:`, error)
  }
}

interface LoadSettingProps<T> {
  default: T
}

export function loadFilter<T, K extends FilterStorageKeys = FilterStorageKeys>(
  keyName: K,
  props: LoadSettingProps<T>,
): () => T {
  return () => {
    const key = FILTERS_STORAGE_KEYS[keyName]
    const storedValue = localStorage.getItem(key)
    if (storedValue) {
      const data = JSON.parse(storedValue)
      if (props.default && props.default instanceof Set) {
        return new Set(data)
      }

      if (props.default && props.default instanceof Date) {
        return new Date(data)
      }

      return data ? data : props.default
    }

    return props.default
  }
}

export function saveFilter<T, K extends FilterStorageKeys = FilterStorageKeys>(keyName: K, value: T) {
  const key = FILTERS_STORAGE_KEYS[keyName]
  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.removeItem(key)
  }
}

export const loadStringSetFilter = (keyName: FilterStorageKeys) =>
  loadFilter(keyName, { default: new Set([] as string[]) })

export const loadNullableDateFilter = (keyName: FilterStorageKeys) =>
  loadFilter<Date | null>(keyName, { default: null })
