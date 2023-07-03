export default defineEventHandler((event) => {
  deleteCookie(event, 'access_token_backstage')
  return {
    message: 'Logout successfully',
  } 
})