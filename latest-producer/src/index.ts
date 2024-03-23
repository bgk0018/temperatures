import { app } from '@azure/functions'

app.timer('getLatest', {
  schedule: '0 */2 * * * *',
  handler: (myTimer, context) => {
    context.log('Timer function processed request.')
  }
})
