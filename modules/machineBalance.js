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
      // log(`Machine ${machine}, with balance ${account.balance().available}`)
      // console.log('Machine ' + machine + ' balance:', account.balance().available)
      resolve(account.balance().available)
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

      console.log('Available balance', account.balance().available)
} */
