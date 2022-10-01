// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
// const sha1 = require('crypto-js/sha1')

async function main() {
  
    function encodeLeaf(address, spots) {
        // Same as `abi.encodePacked` in Solidity
        return ethers.utils.defaultAbiCoder.encode(
          ["address", "uint64"],
          [address, spots]
        );
      }

       // Get a bunch of test addresses
    // const [owner, addr1, addr2, addr3, addr4, addr5] =
    //   await ethers.getSigners();
    
    // Create an array of elements you wish to encode in the Merkle Tree
    const list = [
        await encodeLeaf("0xdbc5f71e9c2791ef453c23e7b8c5bda1bf6cb536", 2)
      ];
  
      // Create the Merkle Tree using the hashing algorithm `keccak256`
      // Make sure to sort the tree so that it can be produced deterministically regardless
      // of the order of the input list
      const merkleTree = new MerkleTree(list, keccak256, {
        hashLeaves: true,
        sortPairs: true,
      });
      // Compute the Merkle Root
      const root = merkleTree.getHexRoot();
      console.log(
        `Root is ${root}`
      );
  
      // Deploy the Whitelist contract
      // const whitelist = await ethers.getContractFactory("Whitelist");
      // const Whitelist = await whitelist.deploy(root);
      // await Whitelist.deployed();
  
      // Compute the Merkle Proof of the owner address (0'th item in list)
      // off-chain. The leaf node is the hash of that value.
      const leaf = keccak256(list[0]);
    //   console.log(`Leaf is: ${leaf}`);
      const proof = merkleTree.getHexProof(leaf);
      console.log(`Proof is ${proof}`);
  
      // Provide the Merkle Proof to the contract, and ensure that it can verify
      // that this leaf node was indeed part of the Merkle Tree
      // let verified = await Whitelist.checkInWhitelist(proof, 2);
      // expect(verified).to.equal(true);
      
      // Provide an invalid Merkle Proof to the contract, and ensure that
      // it can verify that this leaf node was NOT part of the Merkle Tree
      // verified = await Whitelist.checkInWhitelist([], 2);
      // expect(verified).to.equal(false);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
