
/* SQL Script to create Users table and seed it with initial data */

DECLARE @TempPassword NVARCHAR(255) = ''; -- Placeholder for hashed password

CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY NOT NULL,
    UserName NVARCHAR(50) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    MiddleName NVARCHAR(50) NULL,
    SurName NVARCHAR(50) NOT NULL,
    OtherNames NVARCHAR(50) NULL,
    Email NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    PhoneNumber NVARCHAR(15) NULL,
    Color NVARCHAR(7) NULL,
    ProfilePicture NVARCHAR(MAX) NULL,
    ProfilePictureContentType NVARCHAR(10) NULL,
    IsDeleted BIT NOT NULL,
    IsInactive BIT,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NULL,
    CreatedByUserId INT NOT NULL,
    UpdatedByUserId INT NOT NULL
);

INSERT INTO Users (UserName, FirstName, MiddleName, SurName, OtherNames, Email, PasswordHash, PhoneNumber, Color, ProfilePicture, ProfilePictureContentType, IsDeleted, IsInactive, CreatedAt, UpdatedAt, CreatedByUserId, UpdatedByUserId) VALUES
('jsmith', 'John', 'Michael', 'Smith', 'JS', 'jsmith@email.com', @TempPassword, '5551234567', '#FF5733', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('mjones', 'Mary', 'Anne', 'Jones', NULL, 'mjones@email.com', @TempPassword, '5559876543', '#33FF57', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('rbrown', 'Robert', 'James', 'Brown', 'RB', 'rbrown@email.com', @TempPassword, '5555551234', '#3357FF', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('kdavis', 'Karen', 'Elizabeth', 'Davis', NULL, 'kdavis@email.com', @TempPassword, '5552223344', '#FF33F5', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('tmiller', 'Thomas', 'George', 'Miller', 'TM', 'tmiller@email.com', @TempPassword, '5554445566', '#F5FF33', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('swilson', 'Sarah', 'Patricia', 'Wilson', NULL, 'swilson@email.com', @TempPassword, '5556667788', '#33F5FF', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('cmoore', 'Charles', 'Edward', 'Moore', 'CM', 'cmoore@email.com', @TempPassword, '5558889900', '#FFB733', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('ltaylor', 'Linda', 'Marie', 'Taylor', NULL, 'ltaylor@email.com', @TempPassword, '5559990011', '#FF33B7', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('danderson', 'David', 'Paul', 'Anderson', 'DA', 'danderson@email.com', @TempPassword, '5551112222', '#B7FF33', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('bthomas', 'Barbara', 'Louise', 'Thomas', NULL, 'bthomas@email.com', @TempPassword, '5553334444', '#33FFB7', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('pjackson', 'Peter', 'Christopher', 'Jackson', 'PJ', 'pjackson@email.com', @TempPassword, '5552225555', '#FF7333', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('ewhite', 'Emily', 'Rose', 'White', NULL, 'ewhite@email.com', @TempPassword, '5554446666', '#33FF7F', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('mharris', 'Michael', 'Daniel', 'Harris', 'MH', 'mharris@email.com', @TempPassword, '5557778888', '#7F33FF', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('jmartin', 'Jennifer', 'Rebecca', 'Martin', NULL, 'jmartin@email.com', @TempPassword, '5559999000', '#FF33A0', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('wlee', 'William', 'Richard', 'Lee', 'WL', 'wlee@email.com', @TempPassword, '5550001111', '#A0FF33', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('dperez', 'Dorothy', 'Ann', 'Perez', NULL, 'dperez@email.com', @TempPassword, '5552223333', '#33A0FF', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('jthompson', 'James', 'Robert', 'Thompson', 'JT', 'jthompson@email.com', @TempPassword, '5554445555', '#FFAA33', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('agnewton', 'Angela', 'Susan', 'Newton', NULL, 'agnewton@email.com', @TempPassword, '5556667777', '#33FFAA', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('rroberts', 'Richard', 'Joseph', 'Roberts', 'RR', 'rroberts@email.com', @TempPassword, '5558889999', '#AA33FF', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('nscott', 'Nancy', 'Helen', 'Scott', NULL, 'nscott@email.com', @TempPassword, '5550002222', '#FF33CC', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1);




