/**
 * This example genrates a new address.
 */

const path = require('path')
const store = require('data-store')({
  path: path.resolve(__dirname, '../data/', 'run.json')
})
const eurExc = require('./eurExc')
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
      // var currencies = await eurExc()
      // var last = 0.7
      // currencies['stats'].length > 0 ? last = currencies['stats'][currencies['stats'].length - 1][1] : last = last
      var mbal = 0
      if (store.get('mbal.' + machine)) {
        mbal = store.get('mbal.' + machine)
      } else {
        mbal = mbal
      }
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
      store.set('mbal.' + machine, account.balance().available)
      store.load()
      resolve({
        m: machine,
        // t: (account.balance().available - mbal) * 60 / (Math.ceil((1.0/last) * 1000 * 1000000)/1000),
        a: account.balance().available,
        d: (account.balance().available - mbal)
      })
      // resolve(account.balance().available)
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
