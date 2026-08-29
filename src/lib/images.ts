import { openDB, type IDBPDatabase } from 'idb'
import { useEffect, useState } from 'react'
import { uid } from './id'

/**
 * Uploaded images live in IndexedDB as blobs, not in the zustand-persisted
 * page JSON — a couple of hero photos would blow past the localStorage quota
 * instantly. Pages only ever store the string key.
 */

const DB_NAME = 'design-lab'
const STORE = 'images'

let dbPromise: Promise<IDBPDatabase> | null = null

function db() {
  dbPromise ??= openDB(DB_NAME, 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE)) {
        database.createObjectStore(STORE)
      }
    },
  })
  return dbPromise
}

/** objectURL cache — revoking eagerly would break every other <img> reusing it. */
const urlCache = new Map<string, string>()

export async function putImage(file: Blob): Promise<string> {
  const key = uid('img')
  const database = await db()
  await database.put(STORE, file, key)
  return key
}

export async function getImageUrl(key: string): Promise<string | null> {
  const cached = urlCache.get(key)
  if (cached) return cached

  const database = await db()
  const blob = (await database.get(STORE, key)) as Blob | undefined
  if (!blob) return null

  const url = URL.createObjectURL(blob)
  urlCache.set(key, url)
  return url
}

export async function getImageDataUrl(key: string): Promise<string | null> {
  const database = await db()
  const blob = (await database.get(STORE, key)) as Blob | undefined
  if (!blob) return null

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(blob)
  })
}

export async function deleteImage(key: string): Promise<void> {
  const database = await db()
  await database.delete(STORE, key)
  const url = urlCache.get(key)
  if (url) {
    URL.revokeObjectURL(url)
    urlCache.delete(key)
  }
}

/** Resolves an IndexedDB key to a usable src. Returns null while loading. */
export function useImageUrl(key: string | undefined): string | null {
  /* A cache hit is derived during render rather than pushed through state —
   * an image that is already resolved should paint on the first pass, not the
   * second. State carries only the asynchronous resolution, tagged with the
   * key it belongs to so a fast key change never shows the previous image. */
  const [loaded, setLoaded] = useState<{ key: string; url: string | null } | null>(null)

  useEffect(() => {
    if (!key || urlCache.has(key)) return
    let live = true
    void getImageUrl(key).then((url) => {
      if (live) setLoaded({ key, url })
    })
    return () => {
      live = false
    }
  }, [key])

  if (!key) return null
  return urlCache.get(key) ?? (loaded?.key === key ? loaded.url : null)
}

/** Opens a file picker and returns the stored key, or null if cancelled. */
export function pickImage(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) {
        resolve(null)
        return
      }
      void putImage(file).then(resolve)
    }
    // Safari fires no event on cancel; the promise simply never settles, which
    // is fine here because nothing awaits it beyond an optional state update.
    input.click()
  })
}
