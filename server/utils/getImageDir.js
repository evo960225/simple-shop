
export function getGameCarouselImageDir(gameId) {
  
  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const carouselDir = `images/game/${gameId}/carousel/`
  const imagesDir = `${publicDir}/${carouselDir}`
  
  return imagesDir

}