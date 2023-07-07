export default async function delay(delayInms) {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}
  