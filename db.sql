-- Database (adjust name if needed)
CREATE DATABASE IF NOT EXISTS `vcard_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vcard_db`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cards table
CREATE TABLE IF NOT EXISTS `cards` (
  `slug` VARCHAR(191) NOT NULL,
  `cardType` ENUM('personal','business') NOT NULL,
  `ownerEmail` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(191) NULL,
  `role` VARCHAR(191) NULL,
  `company` VARCHAR(191) NULL,
  `businessName` VARCHAR(191) NULL,
  `tagline` VARCHAR(255) NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(100) NULL,
  `website` VARCHAR(255) NULL,
  `address` VARCHAR(255) NULL,
  `bio` TEXT NULL,
  `services` JSON NULL,
  `products` JSON NULL,
  `socials` JSON NULL,
  `profileImage` LONGTEXT NULL,
  `logo` LONGTEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`slug`),
  KEY `idx_cards_ownerEmail` (`ownerEmail`),
  CONSTRAINT `fk_cards_ownerEmail` FOREIGN KEY (`ownerEmail`) REFERENCES `users` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;