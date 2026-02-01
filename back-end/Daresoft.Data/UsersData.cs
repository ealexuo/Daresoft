using Daresoft.Core.Data;
using Daresoft.Core.Models;
using Dapper;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Data;
using System.Xml.Linq;
using System.Drawing;
using Daresoft.Core.Types;
//using Org.BouncyCastle.Asn1.X509;

namespace Daresoft.Data
{
    public class UsersData : IUsersData
    {
        private readonly IConnectionProvider connectionProvider;

        public UsersData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }        

        public async Task<UserProfileModel> CreateAsync(UserProfileModel user, int currentUserId)
        {
            int userProfileId = 0;

            using (var connection = await connectionProvider.OpenAsync())
            {
                string insertContactDataSql = @"            
                INSERT INTO Contact
                (
                    Name
                    ,MiddleName
                    ,LastName
                    ,OtherName
                    ,ContactTypeId
                    ,WorkEmail
                    ,WorkPhone
                    ,WorkPhoneExt
                    ,MobilePhone
                    ,IsSupplier
                    ,IsDeleted
                    ,CreatedDate
                    ,CreatedByUserId
                    ,LastModifiedDate
                    ,UpdatedByUserId
                )
                OUTPUT INSERTED.Id
                VALUES(
                    @Name
                    ,@MiddleName
                    ,@LastName
                    ,@OtherName
                    ,@ContactType
                    ,@WorkEmail
                    ,@WorkPhone
                    ,@WorkPhoneExt
                    ,@MobilePhone
                    ,@IsSupplier
                    ,@IsDeleted
                    ,GETUTCDATE()
                    ,@CreatedByUserId
                    ,GETUTCDATE()
                    ,@UpdatedByUserId
                )";

                string insertUserProfileDataSql = @"
                INSERT INTO UserProfile
                (
                    UserName
                    ,PasswordHash
                    ,ContactId
                    ,IsActive
                    ,RoleId
                    ,IsDeleted
                    ,Color
                    ,ProfilePicture
                    ,IsPasswordChangeRequired
                    ,CreatedDate
                    ,CreatedByUserId
                    ,LastModifiedDate
                    ,UpdatedByUserId
                )
                OUTPUT INSERTED.Id
                VALUES(
                    @UserName
                    ,@PasswordHash
                    ,@ContactId
                    ,@IsActive
                    ,@RoleId
                    ,@IsDeleted
                    ,@Color
                    ,@ProfilePicture
                    ,@IsPasswordChangeRequired
                    ,GETUTCDATE()
                    ,@CreatedByUserId
                    ,GETUTCDATE()
                    ,@UpdatedByUserId
                )";

                using (var trx = connection.BeginTransaction())
                {
                    // Insert contact data
                    int contactId = connection.QuerySingle<int>(insertContactDataSql, new
                    {
                        user.Name,
                        user.MiddleName,
                        user.LastName,
                        user.OtherName,
                        user.WorkEmail,
                        user.WorkPhone,
                        user.WorkPhoneExt,
                        user.MobilePhone,
                        user.IsDeleted,
                        ContactType = ContactTypes.Person,
                        IsSupplier = false,                        
                        CreatedByUserId = currentUserId,
                        UpdatedByUserId = currentUserId
                    }, trx);

                    // Insert users data
                    userProfileId = connection.QuerySingle<int>(insertUserProfileDataSql, new
                    {
                        user.UserName,                        
                        ContactId = contactId,
                        user.IsActive,
                        user.IsDeleted,
                        user.Color,
                        user.ProfilePicture,
                        user.IsPasswordChangeRequired,
                        user.RoleId,
                        PasswordHash = user.Password,
                        CreatedByUserId = currentUserId,
                        UpdatedByUserId = currentUserId
                    }, trx);

                    trx.Commit();
                }                   
            }

            return await GetByIdAsync(userProfileId);
        }

        public async Task<bool> DeleteAsync(int userId, int cuerrentUserId)
        {
            int result = 0;
            
            //Hard delete
            using (var connection = await connectionProvider.OpenAsync())
            {
                string getContactIdSql = @"SELECT ContactId FROM UserProfile WHERE Id = @UserId";
                string hardDeleteUserProfileSql = @"DELETE UserProfile WHERE Id = @UserId";
                string hardDeleteContactSql = @"DELETE Contact WHERE Id = @ContactId";

                using (var trx = connection.BeginTransaction())
                {
                    var ContactId = await connection.QuerySingleAsync<int>(getContactIdSql, new { UserId = userId }, trx);
                    
                    result = await connection.ExecuteAsync(hardDeleteUserProfileSql, new { UserId = userId }, trx);
                    result = await connection.ExecuteAsync(hardDeleteContactSql, new { ContactId }, trx);

                    trx.Commit();
                }
            }

            return result == 1;
        }

        public async Task<UserProfileModel> UpdateAsync(UserProfileModel user, int currentUserId)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string updateContactDataSql = @"
                UPDATE Contact
                SET 
	                Name = @Name
	                ,MiddleName = @MiddleName
	                ,LastName = @LastName
	                ,OtherName = @OtherName
                    ,WorkEmail = @WorkEmail
                    ,WorkPhone = @WorkPhone
                    ,WorkPhoneExt = @WorkPhoneExt
                    ,MobilePhone = @MobilePhone
                    ,LastModifiedDate = GETUTCDATE()
                    ,UpdatedByUserId = @CurrentUserId
                WHERE Id = @ContactId";

                string updateUserProfileData = @"
                UPDATE UserProfile
                SET                         
	                IsActive = @IsActive
                    ,RoleId = @RoleId
	                ,IsDeleted = @IsDeleted
	                ,Color = @Color
                    ,ProfilePicture = @ProfilePicture
                    ,ProfilePictureContentType = @ProfilePictureContentType                        
                    ,IsPasswordChangeRequired = @IsPasswordChangeRequired
                    ,LastModifiedDate = GETUTCDATE()
                    ,UpdatedByUserId = @CurrentUserId
                WHERE Id = @Id";
               
                using (var trx = connection.BeginTransaction())
                {
                    // Update contact data
                    await connection.ExecuteAsync(updateContactDataSql, new
                    {
                        user.ContactId,
                        user.Name,
                        user.MiddleName,
                        user.LastName,
                        user.OtherName,
                        user.WorkEmail,
                        user.WorkPhone,
                        user.WorkPhoneExt,
                        user.MobilePhone,
                        CurrentUserId = currentUserId
                    }, trx);

                    // Update user data
                    await connection.ExecuteAsync(updateUserProfileData, new
                    {
                        user.Id,
                        user.IsActive,
                        user.RoleId,
                        user.IsDeleted,
                        user.Color,
                        user.ProfilePicture,
                        user.ProfilePictureContentType,
                        user.IsPasswordChangeRequired,
                        CurrentUserId = currentUserId
                    }, trx);

                    trx.Commit();
                }                
            }

            return await GetByIdAsync(user.Id);            
        }

        public async Task<List<UserProfileModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
	                 usrp.Id
	                ,usrp.UserName
                    ,usrp.ContactId
	                ,co.Name
	                ,co.MiddleName
	                ,co.LastName	
	                ,co.OtherName
                    ,co.WorkEmail
                    ,co.WorkPhone
                    ,co.WorkPhoneExt
                    ,co.MobilePhone
	                ,usrp.IsActive
                    ,usrp.RoleId
	                ,usrp.IsDeleted
	                ,usrp.Color
                    ,usrp.ProfilePicture
                    ,usrp.ProfilePictureContentType
                    ,usrp.IsPasswordChangeRequired
                    ,COUNT(*) OVER () TotalCount
                FROM UserProfile usrp
                JOIN Contact co on usrp.ContactId = co.Id
                WHERE @SearchText = '*'
                    OR usrp.UserName LIKE '%' + @SearchText + '%'
                    OR CONCAT(co.Name,' ' ,co.MiddleName , ' ' , co.LastName, ' ' , co.OtherName) LIKE '%' + @SearchText + '%'
                    OR co.WorkEmail LIKE '%'+ @SearchText +'%'                    
                ORDER BY UPPER(usrp.UserName) 
                OFFSET (@Offset-1)*@Fetch ROWS
                FETCH NEXT @Fetch ROWS ONLY";

                if (String.IsNullOrEmpty(searchText))
                    searchText = "*";

                var result = await connection.QueryAsync<UserProfileModel>(sqlQuery, new
                {
                    Offset = offset,
                    Fetch = fetch,
                    SearchText = searchText
                });

                return result.ToList();
            }
        }

        public async Task<UserProfileModel> GetByIdAsync(int userId)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"                    
                SELECT 
	                    usrp.Id
	                ,usrp.UserName
                    ,usrp.ContactId
	                ,co.Name
	                ,co.MiddleName
	                ,co.LastName	
	                ,co.OtherName
                    ,co.WorkEmail
                    ,co.WorkPhone
                    ,co.WorkPhoneExt
                    ,co.MobilePhone
	                ,usrp.IsActive
	                ,usrp.IsDeleted
	                ,usrp.Color
                    ,usrp.ProfilePicture
                    ,usrp.ProfilePictureContentType
                    ,usrp.IsPasswordChangeRequired
                    ,1 AS TotalCount
                FROM UserProfile usrp
                JOIN Contact co on usrp.ContactId = co.Id
                WHERE usrp.Id = @Id";

                var result = await connection.QueryAsync<UserProfileModel>(sqlQuery, new { Id = userId });
                return result.FirstOrDefault();
            }
        }

        public async Task<UserProfileModel> GetByUserNameAsync(string userName)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"                    
                SELECT 
	                usrp.Id
	                ,usrp.UserName
                    ,usrp.ContactId
	                ,co.Name
	                ,co.MiddleName
	                ,co.LastName	
	                ,co.OtherName
                    ,co.WorkEmail
                    ,co.WorkPhone
                    ,co.WorkPhoneExt
                    ,co.MobilePhone
	                ,usrp.IsActive
	                ,usrp.IsDeleted
	                ,usrp.Color
                    ,usrp.ProfilePicture
                    ,usrp.ProfilePictureContentType
                    ,usrp.IsPasswordChangeRequired
                    ,1 AS TotalCount
                FROM UserProfile usrp
                JOIN Contact co on usrp.ContactId = co.Id
                WHERE usrp.UserName = @UserName";

                var result = await connection.QueryAsync<UserProfileModel>(sqlQuery, new { UserName = userName });
                return result.FirstOrDefault();
            }
        }       
    }
}