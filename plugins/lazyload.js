const loadImage = (el, binding) => {
  const img = new Image();
  img.src = binding.value;

  img.onload = () => {
    el.src = binding.value;
  };
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazyload', {
    beforeMount(el, binding) {
      el.style.opacity = '1';
      el.style.transition = 'opacity 0.5s';
      loadImage(el, binding);
    },
    updated(el, binding) {
      if (binding.oldValue !== binding.value) {
        loadImage(el, binding);
      }
    },
    loaded(el) {
      el.style.opacity = '1';
    },
  })
})