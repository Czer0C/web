'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Table />
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  )
}

// http://34.143.206.52/videos/download?fileName=Ram-Meme.mp4

const HOST = 'http://34.143.206.52'

const ENDPOINT_LIST = `${HOST}/videos`

interface Video {
  id: string
  bucket: string
  name: string
  size: string
  timeCreated: string
  contentType: string
}

function Table() {
  const [file, setFile] = useState<File>()

  const [list, setList] = useState<Video[]>([])

  const [loading, setLoading] = useState(false)

  const [preview, setPreview] = useState<Video>()

  const handleLoadList = async () => {
    setLoading(true)

    const res = await fetch(ENDPOINT_LIST, {
      // headers: {
      //   Authorization,
      // },
    })

    const data = await res.json()

    setList(data)

    setLoading(false)
  }

  useEffect(() => {
    handleLoadList()
  }, [])

  const downloadFile = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => {
    const fileName = event ? event.currentTarget.id : ''

    const res = await fetch(`${HOST}/videos/download?fileName=${fileName}`, {
      headers: {
        Authorization: 'Bearer test-local',
      },
    })

    const blob = await res.blob()

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url

    a.download = fileName

    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 150)
    }

    a.addEventListener('click', clickHandler, false)

    a.click()
  }

  const handleUpload = async () => {
    const formData = new FormData()

    if (!file) return

    formData.append('video', file)

    const res = await fetch(`${HOST}/videos/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer test-local',
      },
    })

    const data = await res.json()

    console.log(data)

    handleLoadList()
  }

  if (loading) {
    return (
      <div className="flex w-full flex-col rounded-lg bg-sky-900 p-2">
        <div className="grid grid-cols-5 gap-4 border-b-2">
          <span className="text-sm font-semibold text-sky-200">Bucket</span>
          <span className="text-sm font-semibold text-sky-200">File Name</span>
          <span className="text-sm font-semibold text-sky-200">Size</span>
          <span className="text-sm font-semibold text-sky-200">
            Time Uploaded
          </span>
          <span className="text-sm font-semibold text-sky-200">Actions</span>
        </div>

        <div className="flex justify-center">
          <div className="animate-spin w-10 h-10 border-t-2 border-b-2 border-rose-500 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col rounded-lg bg-sky-800 p-2">
      <div className="flex w-full flex-col gap-2">
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => {
            if (!e?.target?.files?.[0]) return

            setFile(e.target.files[0])
          }}
        />

        <button onClick={handleUpload} className="bg-amber-600 rounded-md p-1">
          Upload
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4 border-b-2">
        <span className="text-sm font-semibold text-sky-200">Bucket</span>
        <span className="text-sm font-semibold text-sky-200">File Name</span>
        <span className="text-sm font-semibold text-sky-200">Size</span>
        <span className="text-sm font-semibold text-sky-200">
          Time Uploaded
        </span>
        <span className="text-sm font-semibold text-sky-200">Actions</span>
      </div>

      {list.map((vid) => (
        <div key={vid.id} className="grid grid-cols-5 gap-4 items-center">
          <span className="text-sm font-semibold text-sky-200">
            {vid.bucket}
          </span>
          <span className="text-sm font-semibold text-sky-200">{vid.name}</span>
          <span className="text-sm font-semibold text-sky-200">
            {formatSize(vid.size)}
          </span>
          <span className="text-sm font-semibold text-sky-200">
            {vid.timeCreated}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPreview(vid)}
              className="bg-emerald-600 rounded-md p-1 "
            >
              View
            </button>
            <button
              id={vid.name}
              onClick={downloadFile}
              className="bg-indigo-600 rounded-md p-1"
            >
              Download
            </button>
          </div>
        </div>
      ))}

      {preview && <Preview preview={preview} />}
    </div>
  )
}

function Preview({ preview }: { preview: Video }) {
  const [data, setData] = useState<Blob>()

  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)

    const res = await fetch(
      `${HOST}/videos/download?fileName=${preview.name}`,
      {
        headers: {
          Authorization: 'Bearer test-local',
        },
      }
    )
    const blob = await res.blob()

    setData(blob)

    setLoading(false)
  }

  useEffect(() => {
    if (preview) {
      fetchData()
    }
  }, [preview])

  const type = preview.contentType

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin w-10 h-10 border-t-2 border-b-2 border-rose-500 rounded-full" />
      </div>
    )
  }

  if (!data) {
    return <div>Preview not available</div>
  }

  if (type.includes('image')) {
    return <img src={URL.createObjectURL(data)} alt="preview" />
  }

  if (type.includes('video')) {
    return <video src={URL.createObjectURL(data)} controls />
  }

  return (
    <div>
      <a href={URL.createObjectURL(data)} download={preview.name}>
        Download
      </a>
    </div>
  )
}

const formatSize = (size: string) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  if (size === '0') return 'n/a'

  const val = +size

  const i = Math.floor(Math.log(val) / Math.log(1024))

  return `${(val / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}
