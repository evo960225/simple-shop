
export default async function uploadCheckImageSize(file, checkSize) {
  if (file?.type !== 'image/png' && file?.type !== 'image/jpeg') {
    return false
  }

  const img = new Image()
  const imageLoading = new Promise(resolve => { 
    img.onload = function() {
      if (this.width !== checkSize.width || this.height !== checkSize.height) {
        resolve(false);
      } else {
        resolve(true);
      }
    }
  });

  img.src = URL.createObjectURL(file);
  const result = await imageLoading;
  if (!result) {
    const toleranceSize = window.confirm('圖像的長或寬尺寸錯誤。是否繼續上傳？');
    if (toleranceSize) {
      return true
    } else {
      return false
    }
  }
  return true
}
  