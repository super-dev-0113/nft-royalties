const NFT = artifacts.require("./NFT");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('NFT', ([deployer, artist, owner1, owner2, owner3]) => {
    const cost = web3.utils.toWei('1', 'ether')
    const royalityFee = 25 // 25%
    let nft

    beforeEach(async () => {
        nft = await NFT.new(
            "Famous Paintings",
            "PAINT",
            "ipfs://QmfA7ou6PCd6SukJCmtJHDjHVVHT5p8YXysnJcpsfCjEuo/",
            // royalityFee, // 25%
            artist // Artist
        )
    })

    describe('deployment', () => {
        it('returns the deployer', async () => {
            const result = await nft.owner()
            result.should.equal(deployer)
        })

        it('returns the artist', async () => {
            const result = await nft.artist()
            result.should.equal(artist)
        })

    })

    describe('royalities', async () => {
        const salePrice = web3.utils.toWei('40', 'ether')
        let result

        beforeEach(async () => {
            await nft.mint({ from: owner1, value: cost })
        })

        it('initially belongs to owner1', async () => {
            const result = await nft.balanceOf(owner1)
            result.toString().should.equal('1')
        })

        it('successfully transfers to owner3', async () => {
            await nft.approve(owner3, 1, { from: owner1 })
            await nft.transferFrom(owner1, owner3, 1, { from: owner3, value: salePrice })

            result = await nft.balanceOf(owner1)
            result.toString().should.equal('0')

            result = await nft.balanceOf(owner3)
            result.toString().should.equal('1')

        })

        // it('successfully transfers to owner3', async () => {
        //     await nft.approve(owner3, 1, { from: owner2 })
        //     await nft.transferFrom(owner2, owner3, 1, { from: owner3, value: salePrice })

        //     result = await nft.balanceOf(owner2)
        //     result.toString().should.equal('0')

        //     result = await nft.balanceOf(owner3)
        //     result.toString().should.equal('1')
        // })

    })
})