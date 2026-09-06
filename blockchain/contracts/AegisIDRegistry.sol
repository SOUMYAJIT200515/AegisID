// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AegisIDRegistry {

    // =========================================================
    // STRUCTS
    // =========================================================

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

    struct AssetRecord {
        bytes32 assetHash;
        address ownerAddress;
        uint256 timestamp;
        bool active;
    }


    // =========================================================
    // STORAGE
    // =========================================================

    mapping(bytes32 => IdentityRecord) private identities;

    mapping(bytes32 => CredentialRecord) private credentials;

    mapping(bytes32 => AssetRecord) private assets;


    // =========================================================
    // IDENTITY EVENTS
    // =========================================================

    event IdentityAnchored(
        bytes32 indexed identityHash,
        address indexed walletAddress,
        uint256 timestamp
    );

    event IdentityStatusUpdated(
        bytes32 indexed identityHash,
        bool active
    );


    // =========================================================
    // CREDENTIAL EVENTS
    // =========================================================

    event CredentialAnchored(
        bytes32 indexed credentialHash,
        bytes32 indexed identityHash,
        address indexed issuer,
        uint256 timestamp
    );

    event CredentialStatusUpdated(
        bytes32 indexed credentialHash,
        bool active
    );


    // =========================================================
    // ASSET EVENTS
    // =========================================================

    event AssetAnchored(
        bytes32 indexed assetHash,
        address indexed ownerAddress,
        uint256 timestamp
    );

    event AssetStatusUpdated(
        bytes32 indexed assetHash,
        bool active
    );

    event AssetOwnerUpdated(
        bytes32 indexed assetHash,
        address indexed newOwnerAddress,
        uint256 timestamp
    );


    // =========================================================
    // IDENTITY FUNCTIONS
    // =========================================================

    function anchorIdentity(
        bytes32 identityHash,
        address walletAddress
    ) external {

        require(
            identityHash != bytes32(0),
            "Invalid identity hash"
        );

        require(
            walletAddress != address(0),
            "Invalid wallet address"
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


    // =========================================================
    // CREDENTIAL FUNCTIONS
    // =========================================================

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


    // =========================================================
    // DIGITAL ASSET FUNCTIONS
    // =========================================================

    function anchorAsset(
        bytes32 assetHash,
        address ownerAddress
    ) external {

        require(
            assetHash != bytes32(0),
            "Invalid asset hash"
        );

        require(
            ownerAddress != address(0),
            "Invalid owner address"
        );

        require(
            assets[assetHash].timestamp == 0,
            "Asset already anchored"
        );

        assets[assetHash] = AssetRecord({
            assetHash: assetHash,
            ownerAddress: ownerAddress,
            timestamp: block.timestamp,
            active: true
        });

        emit AssetAnchored(
            assetHash,
            ownerAddress,
            block.timestamp
        );
    }


    function getAsset(
        bytes32 assetHash
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
        AssetRecord memory record =
            assets[assetHash];

        return (
            record.assetHash,
            record.ownerAddress,
            record.timestamp,
            record.active
        );
    }


    function setAssetStatus(
        bytes32 assetHash,
        bool active
    ) external {

        require(
            assets[assetHash].timestamp != 0,
            "Asset not found"
        );

        assets[assetHash].active = active;

        emit AssetStatusUpdated(
            assetHash,
            active
        );
    }


    function updateAssetOwner(
        bytes32 assetHash,
        address newOwnerAddress
    ) external {

        require(
            assets[assetHash].timestamp != 0,
            "Asset not found"
        );

        require(
            newOwnerAddress != address(0),
            "Invalid owner address"
        );

        assets[assetHash].ownerAddress =
            newOwnerAddress;

        emit AssetOwnerUpdated(
            assetHash,
            newOwnerAddress,
            block.timestamp
        );
    }
}