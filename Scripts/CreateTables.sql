
/*

Database: daresoft_test

Audit columns:	
	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL

*/

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
	Name nvarchar(100) NOT NULL,
	MiddleName nvarchar(100) NULL,
	LastName nvarchar(100) NOT NULL,
	OtherName nvarchar(100) NULL,
	Title nvarchar(50) NULL,
	HomeAddressLine1 nvarchar(100) NULL,
	HomeAddressLine2 nvarchar(100) NULL,
	HomeCity nvarchar(50) NULL,
	HomeState nvarchar(50) NULL,
	HomePostalCode nvarchar(20) NULL,
	CountryId int NULL,
	WorkAddressLine1 nvarchar(100) NULL,
	WorkAddressLine2 nvarchar(500) NULL,
	WorkCity nvarchar(50) NULL,
	WorkState nvarchar(50) NULL,
	WorkPostalCode nvarchar(20) NULL,
	WorkCountry nvarchar(100) NULL,
	WorkEmail nvarchar(100) NULL,
	HomeEmail nvarchar(100) NULL,
	HomePhone nvarchar(40) NULL,
	WorkPhone nvarchar(40) NULL,
	WorkPhoneExt nvarchar(10) NULL,	
	MobilePhone nvarchar(40) NULL,
	CompanyId int NULL,
	ContactTypeId int NOT NULL,
	Notes text NULL,
	PreferredAddress int NULL,
	CompanyName nvarchar(150) NULL,
	Website nvarchar(150) NULL,
	PrimaryContactId int NULL,
	IsSupplier bit NOT NULL,
	IsDeleted BIT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
	CreatedByUserId INT NOT NULL,
	UpdatedByUserId INT NOT NULL
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
CREATE TABLE UserProfile (
    Id INT PRIMARY KEY IDENTITY NOT NULL,
    UserName NVARCHAR(50) NOT NULL,    
    PasswordHash NVARCHAR(255) NOT NULL,
	ContactId INT NOT NULL,
    Color NVARCHAR(7) NULL,
    ProfilePicture NVARCHAR(MAX) NULL,
    ProfilePictureContentType NVARCHAR(10) NULL,
    IsInactive BIT NOT NULL,
	IsPasswordChangeRequired BIT NOT NULL,
	IsDeleted BIT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	LastModifiedDate DATETIME NOT NULL,	
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

/* Insert sample contacts */
INSERT INTO Contact (Salutation, Name, MiddleName, LastName, OtherName, Title, HomeAddressLine1, HomeAddressLine2, HomeCity, HomeState, HomePostalCode, CountryId, WorkAddressLine1, WorkAddressLine2, WorkCity, WorkState, WorkPostalCode, WorkCountry, WorkEmail, HomeEmail, HomePhone, WorkPhone, WorkPhoneExt, MobilePhone, CompanyId, ContactTypeId, Notes, PreferredAddress, CompanyName, Website, PrimaryContactId, IsSupplier, IsDeleted, CreatedDate, LastModifiedDate, CreatedByUserId, UpdatedByUserId)
VALUES 
('Mr.', 'John', 'Michael', 'Smith', NULL, 'Manager', '123 Oak Street', 'Apt 4B', 'New York', 'NY', '10001', 1, '456 Business Ave', 'Suite 200', 'New York', 'NY', '10002', 'USA', 'john.smith@company.com', 'john@home.com', '555-1234', '555-5678', '101', '555-9999', 1, 1, 'Senior manager', 1, 'ABC Corporation', 'www.abc.com', NULL, 0, 0, GETDATE(), GETDATE(), 1, 1),
('Ms.', 'Sarah', 'Elizabeth', 'Johnson', NULL, 'Director', '789 Pine Road', '', 'Boston', 'MA', '02101', 1, '321 Corporate Blvd', 'Floor 5', 'Boston', 'MA', '02102', 'USA', 'sarah.johnson@company.com', 'sarah@home.com', '617-2222', '617-3333', '205', '617-4444', 2, 1, 'Department director', 1, 'XYZ Solutions', 'www.xyz.com', NULL, 0, 0, GETDATE(), GETDATE(), 1, 1),
('Dr.', 'Robert', 'James', 'Williams', NULL, 'Consultant', '321 Elm Avenue', 'Unit 10', 'Chicago', 'IL', '60601', 1, '654 Industrial Way', 'Building A', 'Chicago', 'IL', '60602', 'USA', 'robert.williams@company.com', 'robert@home.com', '312-5555', '312-6666', '310', '312-7777', 1, 2, 'External consultant', 2, 'Tech Innovations', 'www.tech.com', NULL, 0, 0, GETDATE(), GETDATE(), 1, 1),
('Mrs.', 'Jennifer', 'Anne', 'Brown', NULL, 'Analyst', '555 Maple Lane', '', 'Seattle', 'WA', '98101', 1, '987 Tech Park', 'Suite 300', 'Seattle', 'WA', '98102', 'USA', 'jennifer.brown@company.com', 'jennifer@home.com', '206-8888', '206-9999', '415', '206-1111', 2, 1, 'Data analyst', 1, 'Data Systems Inc', 'www.datasys.com', NULL, 0, 0, GETDATE(), GETDATE(), 1, 1),
('Mr.', 'David', 'Christopher', 'Lee', NULL, 'Supervisor', '777 Cedar Court', 'Apt 201', 'Denver', 'CO', '80201', 1, '147 Business Park', 'Tower 2', 'Denver', 'CO', '80202', 'USA', 'david.lee@company.com', 'david@home.com', '303-2222', '303-3333', '520', '303-4444', 1, 1, 'Team supervisor', 1, 'Global Services', 'www.global.com', NULL, 0, 0, GETDATE(), GETDATE(), 1, 1);

/* Insert corresponding user profiles */
INSERT INTO UserProfile (UserName, PasswordHash, ContactId, Color, ProfilePicture, ProfilePictureContentType, IsInactive, IsPasswordChangeRequired, IsDeleted, CreatedDate, LastModifiedDate, CreatedByUserId, UpdatedByUserId)
VALUES 
('jsmith', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 1, '#0078D4', NULL, NULL, 0, 0, 0, GETDATE(), GETDATE(), 1, 1),
('sjohnson', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 2, '#107C10', NULL, NULL, 0, 0, 0, GETDATE(), GETDATE(), 1, 1),
('rwilliams', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 3, '#DA3B01', NULL, NULL, 0, 0, 0, GETDATE(), GETDATE(), 1, 1),
('jbrown', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 4, '#EF6950', NULL, NULL, 0, 0, 0, GETDATE(), GETDATE(), 1, 1),
('dlee', 'AQAAAAEAACcQAAAAEO+AN0SKTiMQwoUnw6WX+P/KvjDmW+xdmg6cTX/+c4Phb/bKG+JmdiUQIu9vJooBzA==', 5, '#6B69D6', NULL, NULL, 0, 0, 0, GETDATE(), GETDATE(), 1, 1);
