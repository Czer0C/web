'use server'

const HOST = 'http://34.143.206.52'

export const downloadFile = async (fileName: string) => {
  const res = await fetch(`${HOST}/videos/download?fileName=${fileName}`, {
    headers: {
      Authorization: 'Bearer test-local',
    },
  })

  const blob = await res.blob()

  return blob
}
