package com.AegisID.backend.blockchain.repsitory;

import com.AegisID.backend.blockchain.entity.BlockchainTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlockchainTransactionRepository
        extends JpaRepository<BlockchainTransaction, Long> {

    Optional<BlockchainTransaction> findByOperationId(String operationId);

    Optional<BlockchainTransaction> findByTransactionHash(String transactionHash);
}