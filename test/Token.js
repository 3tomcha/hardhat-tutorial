const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Token Contract", function() {

    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function() {
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        hardhatToken = await Token.deploy();
    });

    describe("Deployment", function() {
        it("Should set the right owner", async function() {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });
        it("ownerが全てのtokenを持つ", async function() {
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(await hardhatToken.totalSupply());
        });
    });

    describe("Transactions", function() {
        // transfer
        // amountがない場合にエラーになる
        // 送るとバランスが減る
        // 送られるとバランスが増える
        it("Transferすると送られた側のバランスが増える", async function() {
            await hardhatToken.transfer(addr1.address, 100);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
        });
        it("Transferすると送った側のバランスが減る", async function() {
            await hardhatToken.transfer(addr1.address, 100);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
            await hardhatToken.connect(addr1).transfer(addr2.address, 100);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(100);
        });
        it("amountがない場合にエラーになる", async function() {
            await expect(hardhatToken.connect(addr1).transfer(addr2.address, 100)).to.be.revertedWith("Not enough tokens");
            // expect(await hardhatToken.balanceOf(addr1.address)).to.be.revertedWith("Not enough tokens");
        });
        it("複数回transferを行うと更新される", async function() {
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(addr1.address, 100);
            await hardhatToken.transfer(addr2.address, 50);

            const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);

            expect(initialOwnerBalance.sub(150)).to.equal(finalOwnerBalance);

            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            const addr2Balance = await hardhatToken.balanceOf(addr2.address);

            expect(addr1Balance).to.equal(100);
            expect(addr2Balance).to.equal(50);
        });
    });
});
