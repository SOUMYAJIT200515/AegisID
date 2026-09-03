// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AegisIDRegistry {

    struct IdentityRecord {
        bytes32 identityHash;
        address walletAddress;
        uint256 timestamp;
        bool active;
    }

    struct CredentialRecord {
        bytes32 credentialHash;
        bytes32 identityHash;
        address issuer;
        uint256 timestamp;
        bool active;
    }

    mapping(bytes32 => IdentityRecord) private identities;
    mapping(bytes32 => CredentialRecord) private credentials;

    event IdentityAnchored(
        bytes32 indexed identityHash,
        address indexed walletAddress,
        uint256 timestamp
    );

    event CredentialAnchored(
        bytes32 indexed credentialHash,
        bytes32 indexed identityHash,
        address indexed issuer,
        uint256 timestamp
    );

    event IdentityStatusUpdated(
        bytes32 indexed identityHash,
        bool active
    );

    event CredentialStatusUpdated(
        bytes32 indexed credentialHash,
        bool active
    );

    function anchorIdentity(
        bytes32 identityHash,
        address walletAddress
    ) external {

        require(
            identityHash != bytes32(0),
            "Invalid identity hash"
        );

        require(
            identities[identityHash].timestamp == 0,
            "Identity already anchored"
        );

        identities[identityHash] = IdentityRecord({
            identityHash: identityHash,
            walletAddress: walletAddress,
            timestamp: block.timestamp,
            active: true
        });

        emit IdentityAnchored(
            identityHash,
            walletAddress,
            block.timestamp
        );
    }

    function anchorCredential(
        bytes32 credentialHash,
        bytes32 identityHash
    ) external {

        require(
            credentialHash != bytes32(0),
            "Invalid credential hash"
        );

        require(
            identityHash != bytes32(0),
            "Invalid identity hash"
        );

        require(
            credentials[credentialHash].timestamp == 0,
            "Credential already anchored"
        );

        credentials[credentialHash] = CredentialRecord({
            credentialHash: credentialHash,
            identityHash: identityHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            active: true
        });

        emit CredentialAnchored(
            credentialHash,
            identityHash,
            msg.sender,
            block.timestamp
        );
    }

    function getIdentity(
        bytes32 identityHash
    )
        external
        view
        returns (
            bytes32,
            address,
            uint256,
            bool
        )
    {
        IdentityRecord memory record =
            identities[identityHash];

        return (
            record.identityHash,
            record.walletAddress,
            record.timestamp,
            record.active
        );
    }

    function getCredential(
        bytes32 credentialHash
    )
        external
        view
        returns (
            bytes32,
            bytes32,
            address,
            uint256,
            bool
        )
    {
        CredentialRecord memory record =
            credentials[credentialHash];

        return (
            record.credentialHash,
            record.identityHash,
            record.issuer,
            record.timestamp,
            record.active
        );
    }

    function setIdentityStatus(
        bytes32 identityHash,
        bool active
    ) external {

        require(
            identities[identityHash].timestamp != 0,
            "Identity not found"
        );

        identities[identityHash].active = active;

        emit IdentityStatusUpdated(
            identityHash,
            active
        );
    }

    function setCredentialStatus(
        bytes32 credentialHash,
        bool active
    ) external {

        require(
            credentials[credentialHash].timestamp != 0,
            "Credential not found"
        );

        credentials[credentialHash].active = active;

        emit CredentialStatusUpdated(
            credentialHash,
            active
        );
    }
}
