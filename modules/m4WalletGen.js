/**
 * This example creates a new database and account
 */

require('dotenv').config()

async function run() {
    const { AccountManager, SignerType } = require('@iota/wallet')
    const manager = new AccountManager({
        storagePath: './m4-database',
    })
    manager.setStrongholdPassword(process.env.M4_PASSWORD)
    manager.storeMnemonic(SignerType.Stronghold)

    const account = await manager.createAccount({
        clientOptions: { node: "https://api.lb-0.testnet.chrysalis2.com", localPow: true },
        alias: 'Machine 4',
    })

    console.log('Account created:', account.alias())

}

run()
