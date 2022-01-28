const NFT = artifacts.require("./NFT");

module.exports = async function (callback) {

    const [deployer, artist, owner1, owner2, owner3] = await web3.eth.getAccounts()
    const mintPrice = web3.utils.toWei('1', 'ether')
    const salePrice = web3.utils.toWei('40', 'ether')

    const nft = await NFT.deployed()


    console.log(`NFT Collection Fetched\n`)

    let deployerBalance = await web3.eth.getBalance(deployer)
    let artistBalance = await web3.eth.getBalance(artist)
    let owner1Balance = await web3.eth.getBalance(owner1)
    let owner2Balance = await web3.eth.getBalance(owner2)
    let owner3Balance = await web3.eth.getBalance(owner3)

    console.log(`Initial balance of deployer | ${web3.utils.fromWei(deployerBalance.toString(), 'ether')}`)
    console.log(`Initial balance of artist   | ${web3.utils.fromWei(artistBalance.toString(), 'ether')}`)
    console.log(`Initial balance of owner1   | ${web3.utils.fromWei(owner1Balance.toString(), 'ether')}`)
    console.log(`Initial balance of owner2   | ${web3.utils.fromWei(owner2Balance.toString(), 'ether')}`)
    console.log(`Initial balance of owner3   | ${web3.utils.fromWei(owner3Balance.toString(), 'ether')}\n`)

    console.log(`Minting NFT for owner1...\n`)

    await nft.mint({ from: owner1, value: mintPrice })

    console.log(`NFT has been minted!\n`)

     deployerBalance = await web3.eth.getBalance(deployer)
     artistBalance = await web3.eth.getBalance(artist)
     owner1Balance = await web3.eth.getBalance(owner1)
     owner2Balance = await web3.eth.getBalance(owner2)
     owner3Balance = await web3.eth.getBalance(owner3)

    console.log(`Initial balance of deployer | ${web3.utils.fromWei(deployerBalance.toString(), 'ether')}`)
    console.log(`Initial balance of artist   | ${web3.utils.fromWei(artistBalance.toString(), 'ether')}`)
    console.log(`Initial balance of owner1   | ${web3.utils.fromWei(owner1Balance.toString(), 'ether')}`)
    console.log(`Initial balance of owner2   | ${web3.utils.fromWei(owner2Balance.toString(), 'ether')}`)
    console.log(`Initial balance of owner3   | ${web3.utils.fromWei(owner3Balance.toString(), 'ether')}\n`)

    console.log(`Performing transfer sale to owner2...\n`)

    await nft.approve(owner2, 1, { from: owner1 })
    await nft.transferFrom(owner1, owner2, 1, { from: owner2, value: salePrice })



     deployerBalance = await web3.eth.getBalance(deployer)
     artistBalance = await web3.eth.getBalance(artist)
     owner1Balance = await web3.eth.getBalance(owner1)
     owner2Balance = await web3.eth.getBalance(owner2)
     owner3Balance = await web3.eth.getBalance(owner3)

    console.log(`Initial balance of deployer | ${web3.utils.fromWei(deployerBalance.toString(), 'ether')}`)
    console.log(`Initial balance of artist   | ${web3.utils.fromWei(artistBalance.toString(), 'ether')}`)
    console.log(`Initial balance of owner1   | ${web3.utils.fromWei(owner1Balance.toString(), 'ether')}`)
    console.log(`Initial balance of owner2   | ${web3.utils.fromWei(owner2Balance.toString(), 'ether')}`)
    console.log(`Initial balance of owner3   | ${web3.utils.fromWei(owner3Balance.toString(), 'ether')}\n`)

  
    console.log(`Performing transfer sale from owner2 to owner3...\n`)

    await nft.approve(owner3, 1, { from: owner2 })
    await nft.transferFrom(owner2, owner3, 1, { from: owner3, value: salePrice })

    console.log(`Transfer complete!\n`)

     deployerBalance = await web3.eth.getBalance(deployer)
     artistBalance = await web3.eth.getBalance(artist)
     owner1Balance = await web3.eth.getBalance(owner1)
     owner2Balance = await web3.eth.getBalance(owner2)
     owner3Balance = await web3.eth.getBalance(owner3)



    console.log(`Initial balance of deployer | ${web3.utils.fromWei(deployerBalance.toString(), 'ether')}`)
    console.log(`Initial balance of artist   | ${web3.utils.fromWei(artistBalance.toString(), 'ether')}`)
    console.log(`Initial balance of owner1   | ${web3.utils.fromWei(owner1Balance.toString(), 'ether')}`)
    console.log(`Initial balance of owner2   | ${web3.utils.fromWei(owner2Balance.toString(), 'ether')}`)
    console.log(`Initial balance of owner3   | ${web3.utils.fromWei(owner3Balance.toString(), 'ether')}\n`)



    let owner1NFTCount = await nft.balanceOf(owner1);
    let owner2NFTCount = await nft.balanceOf(owner2);
    let owner3NFTCount = await nft.balanceOf(owner3);


    console.log("-----------------")
    console.log(`balance of NFT`)
    console.log(`owner1 ${owner1NFTCount.toString()}`);
    console.log(`owner2 ${owner2NFTCount.toString()}`);
    console.log(`owner3 ${owner3NFTCount.toString()}`);
    console.log("-----------------")

    console.log(`Transfer complete!\n`)
    callback()
}