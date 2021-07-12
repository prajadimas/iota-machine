/**
 * This example genrates a new address.
 */

require('dotenv').config()

/**
 *	helper function to log date+text to console:
 */
const log = (text) => {
	console.log(`[${new Date().toLocaleString()}] ${text}`)
}

module.exports = function (machine) {
  return new Promise(async (resolve, reject) => {
    try {
      const { AccountManager } = require('@iota/wallet')
      const manager = new AccountManager({
          storagePath: './m' + machine + '-database'
      })

      manager.setStrongholdPassword(process.env['M' + machine + '_PASSWORD'])

      const account = manager.getAccount('Machine ' + machine)
      // console.log('Account:', account.alias())

      // Always sync before doing anything with the account
      const synced = await account.sync()
      log(`Syncing...`)
      // console.log('Syncing...')

      const { address } = account.generateAddress()
      log(`Machine ${machine}, address on ${address}`)
      // console.log('Machine ' + machine + ' address:', address)
      resolve(address)
    } catch (err) {
      reject(err)
    }
  })
}

/* async function run() {
    const { AccountManager } = require('@iota/wallet')
    const manager = new AccountManager({
        storagePath: './bob-database'
    })

    manager.setStrongholdPassword(process.env.SH_PASSWORD)

    const account = manager.getAccount('Bob')
    // console.log('Account:', account.alias())

    // Always sync before doing anything with the account
    const synced = await account.sync()
    console.log('Syncing...')

    const { address } = account.generateAddress()
    console.log('New address:', address)

    // You can also get the latest unused address:
    // const addressObject = account.latestAddress()
    // console.log("Address:", addressObject.address)

    // Use the Chrysalis Faucet to send testnet tokens to your address:
    // console.log("Fill your address with the Faucet: https://faucet.testnet.chrysalis2.com/")
} */
