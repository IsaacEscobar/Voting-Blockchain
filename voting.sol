// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    // Variables para contar los votos
    uint256 public yesVotes;
    uint256 public noVotes;

    // Mapping para registrar si una dirección ya votó
    mapping(address => bool) public hasVoted;

    // Evento para registrar cuando un voto es emitido
    event Voted(address indexed voter, bool vote, bytes32 signatureHash);

    // Función para votar con firma hash
    function vote(bool _vote, bytes32 _signatureHash) external {
        // Verificar que el votante no haya votado previamente
        require(!hasVoted[msg.sender], "Ya has votado.");

        // Marcar al votante como que ya votó
        hasVoted[msg.sender] = true;

        // Registrar el voto
        if (_vote) {
            yesVotes++;
        } else {
            noVotes++;
        }

        // Emitir el evento con el hash de la firma
        emit Voted(msg.sender, _vote, _signatureHash);
    }

    // Funciones públicas para obtener los resultados de los votos
    function getYesVotes() public view returns (uint256) {
        return yesVotes;
    }

    function getNoVotes() public view returns (uint256) {
        return noVotes;
    }
}
