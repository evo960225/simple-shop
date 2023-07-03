import fs from 'fs'

export function getGameFilesDir(gameId) {
      
  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const gameFilesPath = `${publicDir}/games/${gameId}`
  const filesName = fs.readdirSync(`${gameFilesPath}`, 'utf-8')
  
  const resultData = filesName.map((file) => {
    const stats = fs.statSync(`${gameFilesPath}/${file}`);
    const updateTime = stats.mtime.getTime();
    stats.upda
    return {
      fileName: file,
      updated: updateTime,
    };
  })

  return resultData

}


export function getGamePublicFilesDir(gameId) {
      
  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const gameFilesPath = `${publicDir}/games/${gameId}/public`
  const filesName = fs.readdirSync(`${gameFilesPath}`)
  
  const resultData = filesName.map((file) => {
    const stats = fs.statSync(`${gameFilesPath}/${file}`, 'utf-8');
    const updateTime = stats.mtime.getTime();
    stats.upda
    return {
      fileName: file,
      updated: updateTime,
    };
  })

  return resultData

}