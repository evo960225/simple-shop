export default defineNuxtPlugin(async(nuxtApp) => {
  Array.prototype.asyncForEach = async function(callback) {
    for(let i = 0; i < this.length; i++) {
      await callback(this[i], i, this);
    }
  }
})

  