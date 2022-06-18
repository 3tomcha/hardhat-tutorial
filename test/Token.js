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
});
