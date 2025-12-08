
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserProfile]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[UserProfile]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Contact]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Contact]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ContactType]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[ContactType]
END

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Country]') AND type in (N'U'))
BEGIN
	DROP TABLE [dbo].[Country]
END

/* Country table */
CREATE TABLE Country (
	Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Country PRIMARY KEY CLUSTERED,
	Name NVARCHAR(100) NOT NULL,
	TwoLetterAbbreviation NCHAR(4) NOT NULL
);

/* ContactType table */
CREATE TABLE ContactType(
	Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ContactType PRIMARY KEY CLUSTERED,
	Name nvarchar(50) NOT NULL,
);

/* Contact table */
CREATE TABLE Contact(
	Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Contact PRIMARY KEY CLUSTERED,
	Salutation nvarchar(50) NULL,
	Name nvarchar(100) NULL,
	MiddleName nvarchar(50) NOT NULL,
	LastName nvarchar(100) NULL,
	Title nvarchar(50) NOT NULL,
	HomeAddressLine1 nvarchar(100) NOT NULL,
	HomeAddressLine2 nvarchar(100) NOT NULL,
	HomeCity nvarchar(50) NOT NULL,
	HomeState nvarchar(50) NULL,
	HomePostalCode nvarchar(20) NOT NULL,
	CountryId int NULL,
	WorkAddressLine1 nvarchar(100) NOT NULL,
	WorkAddressLine2 nvarchar(500) NOT NULL,
	WorkCity nvarchar(50) NOT NULL,
	WorkState nvarchar(50) NULL,
	WorkPostalCode nvarchar(20) NOT NULL,
	WorkCountry nvarchar(100) NULL,
	WorkEmail nvarchar(100) NOT NULL,
	HomeEmail nvarchar(100) NOT NULL,
	HomePhone nvarchar(40) NULL,
	WorkPhone nvarchar(40) NULL,
	MobilePhone nvarchar(40) NULL,
	CompanyId int NULL,
	ContactTypeId int NOT NULL,
	Notes text NOT NULL,
	PreferredAddress int NOT NULL,
	CompanyName nvarchar(150) NOT NULL,
	Website nvarchar(150) NOT NULL,
	IsDeleted bit NOT NULL,
	WorkPhoneExt nvarchar(10) NOT NULL,	
	CreatedDate datetime NULL,
	LastModifiedDate datetime NULL,
	PrimaryContactId int NULL,
	IsSupplier bit NULL
);

ALTER TABLE Contact WITH CHECK ADD CONSTRAINT FK_Contact_Contact FOREIGN KEY(CompanyId)
REFERENCES Contact (Id)
GO

ALTER TABLE Contact WITH CHECK ADD CONSTRAINT FK_Contact_Contact_PrimaryContact FOREIGN KEY(PrimaryContactId)
REFERENCES Contact (Id)
GO

ALTER TABLE Contact WITH CHECK ADD CONSTRAINT FK_Contact_ContactType FOREIGN KEY(ContactTypeId)
REFERENCES ContactType (Id)
GO

ALTER TABLE Contact WITH CHECK ADD CONSTRAINT FK_Contact_Country FOREIGN KEY(CountryId)
REFERENCES Country (Id)
GO


/* User table */
DECLARE @TempPassword NVARCHAR(255) = 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA=='; -- Placeholder for hashed password

CREATE TABLE UserProfile (
    Id INT PRIMARY KEY IDENTITY NOT NULL,
    UserName NVARCHAR(50) NOT NULL,    
    PasswordHash NVARCHAR(255) NOT NULL,
	ContactId INT NOT NULL,
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

ALTER TABLE UserProfile WITH CHECK ADD CONSTRAINT FK_User_Contact FOREIGN KEY(ContactId)
REFERENCES Contact (Id)
GO

/* seed with initial data */

INSERT INTO Country (Name, TwoLetterAbbreviation) VALUES
('Afghanista', 'AF'),
('Albania', 'AL'),
('Algeria', 'DZ'),
('Andorra', 'AD'),
('Angola', 'AO'),
('Antigua and Barbuda', 'AG'),
('Argentina', 'AR'),
('Armenia', 'AM'),
('Australia', 'AU'),
('Austria', 'AT'),
('Azerbaija', 'AZ'),
('Bahamas', 'BS'),
('Bahrai', 'BH'),
('Bangladesh', 'BD'),
('Barbados', 'BB'),
('Belarus', 'BY'),
('Belgium', 'BE'),
('Belize', 'BZ'),
('Beni', 'BJ'),
('Bhuta', 'BT'),
('Bolivia', 'BO'),
('Bosnia and Herzegovina', 'BA'),
('Botswana', 'BW'),
('Brazil', 'BR'),
('Brunei', 'B'),
('Bulgaria', 'BG'),
('Burkina Faso', 'BF'),
('Burundi', 'BI'),
('Cabo Verde', 'CV'),
('Cambodia', 'KH'),
('Cameroo', 'CM'),
('Canada', 'CA'),
('Central African Republic', 'CF'),
('Chad', 'TD'),
('Chile', 'CL'),
('China', 'C'),
('Colombia', 'CO'),
('Comoros', 'KM'),
('Congo (Brazzaville)', 'CG'),
('Congo (Kinshasa)', 'CD'),
('Costa Rica', 'CR'),
('Côte d''Ivoire', 'CI'),
('Croatia', 'HR'),
('Cuba', 'CU'),
('Cyprus', 'CY'),
('Czechia', 'CZ'),
('Denmark', 'DK'),
('Djibouti', 'DJ'),
('Dominica', 'DM'),
('Dominican Republic', 'DO'),
('Ecuador', 'EC'),
('Egypt', 'EG'),
('El Salvador', 'SV'),
('Equatorial Guinea', 'GQ'),
('Eritrea', 'ER'),
('Estonia', 'EE'),
('Eswatini', 'SZ'),
('Ethiopia', 'ET'),
('Fiji', 'FJ'),
('Finland', 'FI'),
('France', 'FR'),
('Gabo', 'GA'),
('Gambia', 'GM'),
('Georgia', 'GE'),
('Germany', 'DE'),
('Ghana', 'GH'),
('Greece', 'GR'),
('Grenada', 'GD'),
('Guatemala', 'GT'),
('Guinea', 'G'),
('Guinea-Bissau', 'GW'),
('Guyana', 'GY'),
('Haiti', 'HT'),
('Honduras', 'H'),
('Hungary', 'HU'),
('Iceland', 'IS'),
('India', 'I'),
('Indonesia', 'ID'),
('Ira', 'IR'),
('Iraq', 'IQ'),
('Ireland', 'IE'),
('Israel', 'IL'),
('Italy', 'IT'),
('Jamaica', 'JM'),
('Japa', 'JP'),
('Jorda', 'JO'),
('Kazakhsta', 'KZ'),
('Kenya', 'KE'),
('Kiribati', 'KI'),
('Korea, North', 'KP'),
('Korea, South', 'KR'),
('Kuwait', 'KW'),
('Kyrgyzsta', 'KG'),
('Laos', 'LA'),
('Latvia', 'LV'),
('Lebano', 'LB'),
('Lesotho', 'LS'),
('Liberia', 'LR'),
('Libya', 'LY'),
('Liechtenstei', 'LI'),
('Lithuania', 'LT'),
('Luxembourg', 'LU'),
('Madagascar', 'MG'),
('Malawi', 'MW'),
('Malaysia', 'MY'),
('Maldives', 'MV'),
('Mali', 'ML'),
('Malta', 'MT'),
('Marshall Islands', 'MH'),
('Mauritania', 'MR'),
('Mauritius', 'MU'),
('Mexico', 'MX'),
('Micronesia', 'FM'),
('Moldova', 'MD'),
('Monaco', 'MC'),
('Mongolia', 'M'),
('Montenegro', 'ME'),
('Morocco', 'MA'),
('Mozambique', 'MZ'),
('Myanmar', 'MM'),
('Namibia', 'NA'),
('Nauru', 'NR'),
('Nepal', 'NP'),
('Netherlands', 'NL'),
('New Zealand', 'NZ'),
('Nicaragua', 'NI'),
('Niger', 'NE'),
('Nigeria', 'NG'),
('North Macedonia', 'MK'),
('Norway', 'NO'),
('Oma', 'OM'),
('Pakista', 'PK'),
('Palau', 'PW'),
('Panama', 'PA'),
('Papua New Guinea', 'PG'),
('Paraguay', 'PY'),
('Peru', 'PE'),
('Philippines', 'PH'),
('Poland', 'PL'),
('Portugal', 'PT'),
('Qatar', 'QA'),
('Romania', 'RO'),
('Russia', 'RU'),
('Rwanda', 'RW'),
('Saint Kitts and Nevis', 'K'),
('Saint Lucia', 'LC'),
('Saint Vincent and the Grenadines', 'VC'),
('Samoa', 'WS'),
('San Marino', 'SM'),
('Sao Tome and Principe', 'ST'),
('Saudi Arabia', 'SA'),
('Senegal', 'S'),
('Serbia', 'RS'),
('Seychelles', 'SC'),
('Sierra Leone', 'SL'),
('Singapore', 'SG'),
('Slovakia', 'SK'),
('Slovenia', 'SI'),
('Solomon Islands', 'SB'),
('Somalia', 'SO'),
('South Africa', 'ZA'),
('South Suda', 'SS'),
('Spai', 'ES'),
('Sri Lanka', 'LK'),
('Suda', 'SD'),
('Suriname', 'SR'),
('Swede', 'SE'),
('Switzerland', 'CH'),
('Syria', 'SY'),
('Tajikista', 'TJ'),
('Tanzania', 'TZ'),
('Thailand', 'TH'),
('Timor-Leste', 'TL'),
('Togo', 'TG'),
('Tonga', 'TO'),
('Trinidad and Tobago', 'TT'),
('Tunisia', 'T'),
('Turkey', 'TR'),
('Turkmenista', 'TM'),
('Tuvalu', 'TV'),
('Uganda', 'UG'),
('Ukraine', 'UA'),
('United Arab Emirates', 'AE'),
('United Kingdom', 'GB'),
('United States', 'US'),
('Uruguay', 'UY'),
('Uzbekista', 'UZ'),
('Vanuatu', 'VU'),
('Vatican City', 'VA'),
('Venezuela', 'VE'),
('Vietnam', 'V'),
('Yeme', 'YE'),
('Zambia', 'ZM'),
('Zimbabwe', 'ZW');

INSERT INTO ContactType (Name) VALUES
('Person'),
('Business');


/* Suppliers*/
-- TODO: Add supplier data if needed


/* Users*/
INSERT INTO Contact (Salutation, Name, MiddleName, LastName, Title, HomeAddressLine1, HomeAddressLine2, HomeCity, HomeState, HomePostalCode, CountryId, WorkAddressLine1, WorkAddressLine2, WorkCity, WorkState, WorkPostalCode, WorkCountry, WorkEmail, HomeEmail, HomePhone, WorkPhone, MobilePhone, ContactTypeId, Notes, PreferredAddress, CompanyName, Website, IsDeleted, WorkPhoneExt, CreatedDate, LastModifiedDate, IsSupplier)
VALUES
('Mr.', 'John', 'Michael', 'Smith', 'Manager', '123 Main St', '', 'New York', 'NY', '10001', NULL, '456 Business Ave', 'Suite 100', 'New York', 'NY', '10002', 'United States', 'john.smith@company.com', 'john@home.com', '555-0001', '555-0002', '555-0003', 1, 'Sales Manager', 1, '', '', 0, '100', GETDATE(), NULL, 0),
('Ms.', 'Sarah', 'Jane', 'Johnson', 'Director', '789 Oak Rd', '', 'Los Angeles', 'CA', '90001', NULL, '321 Corporate Dr', 'Floor 5', 'Los Angeles', 'CA', '90002', 'United States', 'sarah.johnson@company.com', 'sarah@home.com', '555-0004', '555-0005', '555-0006', 1, 'Sales Director', 1, '', '', 0, '101', GETDATE(), NULL, 0),
('Mr.', 'Robert', 'James', 'Williams', 'Analyst', '654 Elm St', '', 'Chicago', 'IL', '60601', NULL, '789 Tech Park', 'Bldg A', 'Chicago', 'IL', '60602', 'United States', 'robert.williams@company.com', 'robert@home.com', '555-0007', '555-0008', '555-0009', 1, 'Data Analyst', 1, '', '', 0, '102', GETDATE(), NULL, 0),
('Ms.', 'Emily', 'Marie', 'Brown', 'Coordinator', '321 Pine Ave', '', 'Houston', 'TX', '77001', NULL, '654 Office Blvd', 'Suite 200', 'Houston', 'TX', '77002', 'United States', 'emily.brown@company.com', 'emily@home.com', '555-0010', '555-0011', '555-0012', 1, 'Project Coordinator', 1, '', '', 0, '103', GETDATE(), NULL, 0),
('Mr.', 'David', 'Christopher', 'Davis', 'Specialist', '987 Maple Dr', '', 'Phoenix', 'AZ', '85001', NULL, '123 Innovation Way', 'Floor 3', 'Phoenix', 'AZ', '85002', 'United States', 'david.davis@company.com', 'david@home.com', '555-0013', '555-0014', '555-0015', 1, 'Technical Specialist', 1, '', '', 0, '104', GETDATE(), NULL, 0);

INSERT INTO UserProfile (UserName, PasswordHash, ContactId, Color, ProfilePicture, ProfilePictureContentType, IsDeleted, IsInactive, CreatedAt, UpdatedAt, CreatedByUserId, UpdatedByUserId)
VALUES
('jsmith', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 1, '#FF5733', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('sjohnson', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 2, '#33FF57', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('rwilliams', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 3, '#3357FF', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('ebrown', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 4, '#FF33F1', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1),
('ddavis', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 5, '#F1FF33', NULL, NULL, 0, 0, GETDATE(), NULL, 1, 1);

