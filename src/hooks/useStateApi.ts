import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

export default function useStateApi<T>(url: string, field?: string): [T | null, boolean, Error | null] {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = () => {
      axios
        .get<T>(url)
        .then((res: AxiosResponse<T>) => {
          const responseData = res.data
          if (field) {
            setData(responseData[field as keyof T] as T)
          } else {
            setData(responseData)
          }
        })
        .catch((error: Error) => {
          setError(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchData()

    return () => {
      // Cleanup function
    }
  }, [url, field])

  return [data, loading, error]
}
