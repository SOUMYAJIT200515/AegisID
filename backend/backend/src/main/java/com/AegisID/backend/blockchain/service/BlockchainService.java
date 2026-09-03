package com.AegisID.backend.blockchain.service;

import com.AegisID.backend.blockchain.config.BlockchainConfig;
import com.AegisID.backend.blockchain.entity.BlockchainTransaction;
import com.AegisID.backend.blockchain.repsitory.BlockchainTransactionRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;

import org.web3j.crypto.Credentials;

import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthCall;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;

import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class BlockchainService {

    private final Web3j web3j;
    private final BlockchainConfig blockchainConfig;
    private final BlockchainTransactionRepository transactionRepository;

    private static final BigInteger GAS_PRICE =
            BigInteger.valueOf(1_500_000_000L);

    private static final BigInteger GAS_LIMIT =
            BigInteger.valueOf(200_000);

    @Value("${blockchain.private-key}")
    private String privateKey;


    public BlockchainService(
            Web3j web3j,
            BlockchainConfig blockchainConfig,
            BlockchainTransactionRepository transactionRepository) {

        this.web3j = web3j;
        this.blockchainConfig = blockchainConfig;
        this.transactionRepository = transactionRepository;
    }


    // =========================================================
    // BLOCKCHAIN CONNECTION
    // =========================================================

    public String getNetworkVersion() throws Exception {

        return web3j
                .netVersion()
                .send()
                .getResult();
    }


    public BigInteger getBlockNumber() throws Exception {

        return web3j
                .ethBlockNumber()
                .send()
                .getBlockNumber();
    }


    // =========================================================
    // CONTRACT INFORMATION
    // =========================================================

    public String getContractAddress() {

        return blockchainConfig.getContractAddress();
    }


    // =========================================================
    // READ IDENTITY
    // =========================================================

    public List<Type> getIdentity(
            String identityHash)
            throws Exception {

        validateIdentityHash(identityHash);

        Function function = new Function(
                "getIdentity",

                Arrays.asList(
                        new Bytes32(
                                Numeric.hexStringToByteArray(
                                        identityHash
                                )
                        )
                ),

                Arrays.asList(
                        new TypeReference<Bytes32>() {},
                        new TypeReference<Address>() {},
                        new TypeReference<Uint256>() {},
                        new TypeReference<Bool>() {}
                )
        );


        String encodedFunction =
                FunctionEncoder.encode(function);


        EthCall response = web3j
                .ethCall(
                        Transaction.createEthCallTransaction(
                                null,
                                blockchainConfig.getContractAddress(),
                                encodedFunction
                        ),
                        DefaultBlockParameterName.LATEST
                )
                .send();


        if (response.hasError()) {

            throw new RuntimeException(
                    "Blockchain contract call failed: "
                            + response.getError().getMessage()
            );
        }


        return FunctionReturnDecoder.decode(
                response.getValue(),
                function.getOutputParameters()
        );
    }


    // =========================================================
    // ANCHOR IDENTITY
    // =========================================================

    public String anchorIdentity(
            String identityHash,
            String walletAddress)
            throws Exception {

        validateIdentityHash(identityHash);
        validateWalletAddress(walletAddress);


        // =========================================
        // CREATE TRANSACTION RECORD
        // =========================================

        BlockchainTransaction blockchainTransaction =
                new BlockchainTransaction();

        String operationId =
                "IDENTITY_ANCHOR-" + UUID.randomUUID();

        blockchainTransaction.setOperationId(operationId);

        blockchainTransaction.setOperationType(
                BlockchainTransaction.OperationType.IDENTITY_ANCHOR
        );

        blockchainTransaction.setEntityType("IDENTITY");

        blockchainTransaction.setChainId(
                Long.parseLong(
                        getNetworkVersion()
                )
        );

        blockchainTransaction.setContractAddress(
                blockchainConfig.getContractAddress()
        );

        blockchainTransaction.setStatus(
                BlockchainTransaction.TransactionStatus.PENDING
        );


        BlockchainTransaction savedTransaction =
                transactionRepository.save(
                        blockchainTransaction
                );


        try {

            // =========================================
            // LOAD BLOCKCHAIN ACCOUNT
            // =========================================

            Credentials credentials =
                    Credentials.create(privateKey);

            String senderAddress =
                    credentials.getAddress();

            savedTransaction.setFromAddress(
                    senderAddress
            );

            savedTransaction.setToAddress(
                    blockchainConfig.getContractAddress()
            );

            savedTransaction.setStatus(
                    BlockchainTransaction.TransactionStatus.SUBMITTED
            );

            savedTransaction.setSubmittedAt(
                    LocalDateTime.now()
            );

            transactionRepository.save(
                    savedTransaction
            );


            // =========================================
            // CREATE SOLIDITY FUNCTION
            // =========================================

            Function function = new Function(
                    "anchorIdentity",

                    Arrays.asList(

                            new Bytes32(
                                    Numeric.hexStringToByteArray(
                                            identityHash
                                    )
                            ),

                            new Address(walletAddress)
                    ),

                    List.of()
            );


            String encodedFunction =
                    FunctionEncoder.encode(function);


            // =========================================
            // TRANSACTION MANAGER
            // =========================================

            TransactionManager transactionManager =
                    new RawTransactionManager(
                            web3j,
                            credentials
                    );


            // =========================================
            // SEND TRANSACTION
            // =========================================

            EthSendTransaction transaction =
                    transactionManager.sendTransaction(
                            GAS_PRICE,
                            GAS_LIMIT,
                            blockchainConfig.getContractAddress(),
                            encodedFunction,
                            BigInteger.ZERO
                    );


            // =========================================
            // CHECK SUBMISSION
            // =========================================

            if (transaction.hasError()) {

                savedTransaction.setStatus(
                        BlockchainTransaction.TransactionStatus.FAILED
                );

                savedTransaction.setErrorMessage(
                        transaction.getError().getMessage()
                );

                transactionRepository.save(
                        savedTransaction
                );

                throw new RuntimeException(
                        "Blockchain transaction failed: "
                                + transaction.getError().getMessage()
                );
            }


            String transactionHash =
                    transaction.getTransactionHash();


            savedTransaction.setTransactionHash(
                    transactionHash
            );

            transactionRepository.save(
                    savedTransaction
            );


            // =========================================
            // WAIT FOR RECEIPT
            // =========================================

            TransactionReceipt receipt =
                    waitForReceipt(transactionHash);


            // =========================================
            // CHECK RECEIPT
            // =========================================

            if (!receipt.isStatusOK()) {

                savedTransaction.setStatus(
                        BlockchainTransaction.TransactionStatus.FAILED
                );

                savedTransaction.setErrorMessage(
                        "Blockchain transaction reverted"
                );

                transactionRepository.save(
                        savedTransaction
                );

                throw new RuntimeException(
                        "Blockchain transaction reverted: "
                                + transactionHash
                );
            }


            // =========================================
            // SAVE CONFIRMED TRANSACTION
            // =========================================

            savedTransaction.setStatus(
                    BlockchainTransaction.TransactionStatus.CONFIRMED
            );

            savedTransaction.setBlockNumber(
                    receipt.getBlockNumber().longValue()
            );

            savedTransaction.setGasUsed(
                    receipt.getGasUsed().longValue()
            );

            savedTransaction.setConfirmedAt(
                    LocalDateTime.now()
            );

            transactionRepository.save(
                    savedTransaction
            );


            return transactionHash;

        } catch (Exception exception) {

            // =========================================
            // SAVE FAILURE
            // =========================================

            if (savedTransaction.getStatus()
                    != BlockchainTransaction.TransactionStatus.CONFIRMED) {

                savedTransaction.setStatus(
                        BlockchainTransaction.TransactionStatus.FAILED
                );

                savedTransaction.setErrorMessage(
                        exception.getMessage()
                );

                transactionRepository.save(
                        savedTransaction
                );
            }

            throw exception;
        }
    }


    // =========================================================
    // READ CREDENTIAL
    // =========================================================

    public List<Type> getCredential(
            String credentialHash)
            throws Exception {

        validateCredentialHash(credentialHash);

        Function function = new Function(
                "getCredential",

                Arrays.asList(
                        new Bytes32(
                                Numeric.hexStringToByteArray(
                                        credentialHash
                                )
                        )
                ),

                Arrays.asList(
                        new TypeReference<Bytes32>() {},
                        new TypeReference<Bytes32>() {},
                        new TypeReference<Address>() {},
                        new TypeReference<Uint256>() {},
                        new TypeReference<Bool>() {}
                )
        );


        String encodedFunction =
                FunctionEncoder.encode(function);


        EthCall response = web3j
                .ethCall(
                        Transaction.createEthCallTransaction(
                                null,
                                blockchainConfig.getContractAddress(),
                                encodedFunction
                        ),
                        DefaultBlockParameterName.LATEST
                )
                .send();


        if (response.hasError()) {

            throw new RuntimeException(
                    "Blockchain contract call failed: "
                            + response.getError().getMessage()
            );
        }


        return FunctionReturnDecoder.decode(
                response.getValue(),
                function.getOutputParameters()
        );
    }


    // =========================================================
    // ANCHOR CREDENTIAL
    // =========================================================

    public String anchorCredential(
            String credentialHash,
            String identityHash)
            throws Exception {

        validateCredentialHash(credentialHash);
        validateIdentityHash(identityHash);


        // =========================================
        // CREATE TRANSACTION RECORD
        // =========================================

        BlockchainTransaction blockchainTransaction =
                new BlockchainTransaction();

        String operationId =
                "CREDENTIAL_ANCHOR-" + UUID.randomUUID();

        blockchainTransaction.setOperationId(
                operationId
        );

        blockchainTransaction.setOperationType(
                BlockchainTransaction.OperationType.CREDENTIAL_ANCHOR
        );

        blockchainTransaction.setEntityType(
                "CREDENTIAL"
        );

        blockchainTransaction.setChainId(
                Long.parseLong(
                        getNetworkVersion()
                )
        );

        blockchainTransaction.setContractAddress(
                blockchainConfig.getContractAddress()
        );

        blockchainTransaction.setStatus(
                BlockchainTransaction.TransactionStatus.PENDING
        );


        BlockchainTransaction savedTransaction =
                transactionRepository.save(
                        blockchainTransaction
                );


        try {

            // =========================================
            // LOAD BLOCKCHAIN ACCOUNT
            // =========================================

            Credentials credentials =
                    Credentials.create(privateKey);

            String senderAddress =
                    credentials.getAddress();


            savedTransaction.setFromAddress(
                    senderAddress
            );

            savedTransaction.setToAddress(
                    blockchainConfig.getContractAddress()
            );

            savedTransaction.setStatus(
                    BlockchainTransaction.TransactionStatus.SUBMITTED
            );

            savedTransaction.setSubmittedAt(
                    LocalDateTime.now()
            );

            transactionRepository.save(
                    savedTransaction
            );


            // =========================================
            // CREATE SOLIDITY FUNCTION
            // =========================================

            Function function = new Function(
                    "anchorCredential",

                    Arrays.asList(

                            new Bytes32(
                                    Numeric.hexStringToByteArray(
                                            credentialHash
                                    )
                            ),

                            new Bytes32(
                                    Numeric.hexStringToByteArray(
                                            identityHash
                                    )
                            )
                    ),

                    List.of()
            );


            String encodedFunction =
                    FunctionEncoder.encode(
                            function
                    );


            // =========================================
            // TRANSACTION MANAGER
            // =========================================

            TransactionManager transactionManager =
                    new RawTransactionManager(
                            web3j,
                            credentials
                    );


            // =========================================
            // SEND TRANSACTION
            // =========================================

            EthSendTransaction transaction =
                    transactionManager.sendTransaction(
                            GAS_PRICE,
                            GAS_LIMIT,
                            blockchainConfig.getContractAddress(),
                            encodedFunction,
                            BigInteger.ZERO
                    );


            // =========================================
            // CHECK SUBMISSION
            // =========================================

            if (transaction.hasError()) {

                savedTransaction.setStatus(
                        BlockchainTransaction.TransactionStatus.FAILED
                );

                savedTransaction.setErrorMessage(
                        transaction.getError().getMessage()
                );

                transactionRepository.save(
                        savedTransaction
                );

                throw new RuntimeException(
                        "Blockchain credential transaction failed: "
                                + transaction.getError().getMessage()
                );
            }


            String transactionHash =
                    transaction.getTransactionHash();


            savedTransaction.setTransactionHash(
                    transactionHash
            );

            transactionRepository.save(
                    savedTransaction
            );


            // =========================================
            // WAIT FOR RECEIPT
            // =========================================

            TransactionReceipt receipt =
                    waitForReceipt(transactionHash);


            // =========================================
            // CHECK RECEIPT
            // =========================================

            if (!receipt.isStatusOK()) {

                savedTransaction.setStatus(
                        BlockchainTransaction.TransactionStatus.FAILED
                );

                savedTransaction.setErrorMessage(
                        "Blockchain credential transaction reverted"
                );

                transactionRepository.save(
                        savedTransaction
                );

                throw new RuntimeException(
                        "Blockchain credential transaction reverted: "
                                + transactionHash
                );
            }


            // =========================================
            // SAVE CONFIRMED TRANSACTION
            // =========================================

            savedTransaction.setStatus(
                    BlockchainTransaction.TransactionStatus.CONFIRMED
            );

            savedTransaction.setBlockNumber(
                    receipt.getBlockNumber().longValue()
            );

            savedTransaction.setGasUsed(
                    receipt.getGasUsed().longValue()
            );

            savedTransaction.setConfirmedAt(
                    LocalDateTime.now()
            );

            transactionRepository.save(
                    savedTransaction
            );


            return transactionHash;

        } catch (Exception exception) {

            // =========================================
            // SAVE FAILURE
            // =========================================

            if (savedTransaction.getStatus()
                    != BlockchainTransaction.TransactionStatus.CONFIRMED) {

                savedTransaction.setStatus(
                        BlockchainTransaction.TransactionStatus.FAILED
                );

                savedTransaction.setErrorMessage(
                        exception.getMessage()
                );

                transactionRepository.save(
                        savedTransaction
                );
            }

            throw exception;
        }
    }


    // =========================================================
    // VALIDATE IDENTITY HASH
    // =========================================================

    private void validateIdentityHash(
            String identityHash) {

        if (identityHash == null ||
                !identityHash.matches(
                        "^0x[0-9a-fA-F]{64}$")) {

            throw new IllegalArgumentException(
                    "Identity hash must be a valid bytes32 hex value"
            );
        }
    }


    // =========================================================
    // VALIDATE CREDENTIAL HASH
    // =========================================================

    private void validateCredentialHash(
            String credentialHash) {

        if (credentialHash == null ||
                !credentialHash.matches(
                        "^0x[0-9a-fA-F]{64}$")) {

            throw new IllegalArgumentException(
                    "Credential hash must be a valid bytes32 hex value"
            );
        }
    }


    // =========================================================
    // VALIDATE WALLET ADDRESS
    // =========================================================

    private void validateWalletAddress(
            String walletAddress) {

        if (walletAddress == null ||
                !walletAddress.matches(
                        "^0x[0-9a-fA-F]{40}$")) {

            throw new IllegalArgumentException(
                    "Wallet address must be a valid Ethereum address"
            );
        }
    }


    // =========================================================
    // WAIT FOR TRANSACTION
    // =========================================================

    private TransactionReceipt waitForReceipt(
            String transactionHash)
            throws Exception {

        for (int i = 0; i < 30; i++) {

            var receipt =
                    web3j
                            .ethGetTransactionReceipt(
                                    transactionHash
                            )
                            .send();

            if (receipt
                    .getTransactionReceipt()
                    .isPresent()) {

                return receipt
                        .getTransactionReceipt()
                        .get();
            }

            Thread.sleep(1000);
        }


        throw new RuntimeException(
                "Transaction receipt not received: "
                        + transactionHash
        );
    }
}