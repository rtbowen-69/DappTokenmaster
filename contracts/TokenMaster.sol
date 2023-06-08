// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // Imports contract fromoz for ERC721

contract TokenMaster is ERC721 { // '...is ERC721' Gives the power of the contract from open zepplin
  address public owner;
  uint256 public totalOccasions; //counter avaiable to track total events(occasions)
  uint256 public totalSupply; // counter to track the total supply of minted NFTs

  struct Occasion {  // tells us how the occasion is created
    uint256 id;
    string name;
    uint256 cost;
    uint256 tickets;
    uint256 maxTickets;
    string date;
    string time;
    string location;
  }

  mapping(uint256 => Occasion) occasions; // Creats the key-value pairs (Defined it here)
  mapping(uint256 => mapping(address => bool)) public hasBought; // Creats the mapping of who has already pruchased seats
  mapping(uint256 => mapping(uint256 => address)) public seatTaken;  // Tracks which seats were already purchased (nested Mapping)
  mapping(uint256 => uint256[]) seatsTaken;

  modifier onlyOwner() {
    require(msg.sender == owner );
    _;  // Forces the onlyOwner to be first before any of the other code executes
  }

  constructor(
    string memory _name,
    string memory _symbol
  ) ERC721(_name, _symbol) {
      owner = msg.sender;

  }

  function list(        //creats all the variables needed for the event dates, times and places
    string memory _name,
    uint256 _cost,
    uint256 _maxTickets,
    string memory _date,
    string memory _time,
    string memory _location
  ) public onlyOwner {

    totalOccasions++;
    occasions[totalOccasions] = Occasion(     // Creats the ocassion within the list function
      totalOccasions,
      _name,
      _cost,
      _maxTickets,
      _maxTickets,
      _date,
      _time,
      _location
    );

  }

  function mint(uint _id, uint256 _seat) public payable {  // payable must be here to get purchaser to send in the eth

    require(_id != 0); // Require that _id is not 0
    require(_id <= totalOccasions); // Require that the _id is less than total occasions
    require(msg.value >= occasions[_id].cost); // require that the correct amount of ether is being sent for the correct event(occasion)
    require(seatTaken[_id][_seat] == address(0)); // Requires the seat to exist
    require(_seat <= occasions[_id].maxTickets); // Requires that there are still tickets available and not taken


    occasions[_id].tickets -= 1; // subtracts 1 ticket from the tickets available for the occasian

    hasBought[_id][msg.sender] = true; // updates the buying status
    seatTaken[_id][_seat] = msg.sender; // assigns seats and occasion

    seatsTaken[_id].push(_seat); // updates seats already taken and updates the array

    totalSupply++;

    _safeMint(msg.sender, totalSupply);
  }

  function getOccasion(uint256 _id) public view returns (Occasion memory) {
    return occasions[_id];
  }

  function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
    return seatsTaken[_id];
  }

  function withdraw() public onlyOwner {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success);    
  }
   
}
