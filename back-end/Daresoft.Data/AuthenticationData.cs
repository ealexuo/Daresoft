using Daresoft.Core.Data;
using Daresoft.Core.Models;
using Dapper;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using System.Data;
//using Org.BouncyCastle.Asn1.X509;

namespace Daresoft.Data
{
    public class AuthenticationData : IAuthenticationData
    {
        private readonly IConnectionProvider connectionProvider;

        public AuthenticationData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }

        public Task<int> ChangePasswordAsync(int userId, string password)
        {
            throw new NotImplementedException();
        }

        public async Task<SignInModel> GetByUserName(string userName)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"                    
                    SELECT 
                         Id
                        ,UserName
                        ,PasswordHash AS Password    
                        ,IsPasswordChangeRequired
                    FROM UserProfile
                    WHERE UserName = @userName
                ";
                var result = await connection.QueryAsync<SignInModel>(sqlQuery, new { userName });
                return result.FirstOrDefault();
            }
        }

        public Task<int> SavePasswordAsync(SignInModel signInModel)
        {
            throw new NotImplementedException();
        }

        public Task<int> SignInRegistration(int userId, DateTime createdDate)
        {
            throw new NotImplementedException();
        }
    }
}