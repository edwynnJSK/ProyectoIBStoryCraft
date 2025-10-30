-- Script de inicialización de base de datos para StoryCraft
-- Este script crea la base de datos, usuario y permisos necesarios

USE master;
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'BDD_STORYCRAFT')
BEGIN
    CREATE DATABASE BDD_STORYCRAFT;
    PRINT 'Base de datos BDD_STORYCRAFT creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'Base de datos BDD_STORYCRAFT ya existe.';
END
GO

-- Usar la base de datos
USE BDD_STORYCRAFT;
GO

-- Crear login si no existe
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'usr_storycraft')
BEGIN
    CREATE LOGIN usr_storycraft WITH PASSWORD = 'Politecnica1';
    PRINT 'Login usr_storycraft creado exitosamente.';
END
ELSE
BEGIN
    PRINT 'Login usr_storycraft ya existe.';
END
GO

-- Crear usuario en la base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'usr_storycraft')
BEGIN
    CREATE USER usr_storycraft FOR LOGIN usr_storycraft;
    PRINT 'Usuario usr_storycraft creado exitosamente.';
END
ELSE
BEGIN
    PRINT 'Usuario usr_storycraft ya existe.';
END
GO

-- Otorgar permisos
ALTER ROLE db_owner ADD MEMBER usr_storycraft;
GO

PRINT 'Permisos otorgados a usr_storycraft.';

-- Crear tabla Users
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
BEGIN
    CREATE TABLE Users (
        UserID INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) NOT NULL,
        Email NVARCHAR(100) UNIQUE NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        Password NVARCHAR(255) NOT NULL
    );
    PRINT 'Tabla Users creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'Tabla Users ya existe.';
END
GO

-- Crear tabla Stories
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Stories')
BEGIN
    CREATE TABLE Stories (
        StoryID INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX),
        AuthorID INT NOT NULL,
        Status NVARCHAR(20) DEFAULT 'draft',
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        Genre NVARCHAR(50) NOT NULL,
        MaturityRating NVARCHAR(20) NOT NULL,
        ImagePath NVARCHAR(255) DEFAULT 'default-story-image.jpg'
    );
    PRINT 'Tabla Stories creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'Tabla Stories ya existe.';
END
GO

-- Crear tabla Chapters
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Chapters')
BEGIN
    CREATE TABLE Chapters (
        ChapterID INT IDENTITY(1,1) PRIMARY KEY,
        StoryID INT NOT NULL,
        Title NVARCHAR(100) NOT NULL,
        Content NVARCHAR(MAX),
        ChapterNumber INT NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        ImagePath NVARCHAR(MAX) DEFAULT 'default-chapter-image.jpg'
    );
    PRINT 'Tabla Chapters creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'Tabla Chapters ya existe.';
END
GO

-- Crear tabla de migraciones de Prisma si no existe
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '_prisma_migrations')
BEGIN
    CREATE TABLE _prisma_migrations (
        id NVARCHAR(36) PRIMARY KEY,
        checksum NVARCHAR(64) NOT NULL,
        finished_at DATETIME2,
        migration_name NVARCHAR(255) NOT NULL,
        logs NVARCHAR(MAX),
        rolled_back_at DATETIME2,
        started_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        applied_steps_count INT DEFAULT 0 NOT NULL
    );
    PRINT 'Tabla _prisma_migrations creada exitosamente.';
END
GO

PRINT 'Inicialización de base de datos completada exitosamente!';
GO
