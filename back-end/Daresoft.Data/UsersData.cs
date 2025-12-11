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
    public class UsersData : IUsersData
    {
        private readonly IConnectionProvider connectionProvider;

        public UsersData(IConnectionProvider connectionProvider)
        {
            this.connectionProvider = connectionProvider;
        }        

        public async Task<int> CreateAsync(UserProfileModel user, string password, DateTime createdDate, int createdByUserId)
        {
            //using (var connection = await connectionProvider.OpenAsync())
            //{
            //    string insertarUsuarioSQL = @"                
            //    INSERT INTO Usuario
            //    (
            //        Id, IdEntidad, NoIdentificacionPersonal, CorreoElectronico, PrimerNombre, SegundoNombre, OtrosNombres, PrimerApellido, SegundoApellido, 
            //        ApellidoCasada, Titulo, Cargo, Extension, Telefono, Activo, Genero, Password, IdEstado, IdUnidadAdministrativa, RequiereCambioPassword, 
            //        FechaRegistro, UsuarioRegistro, IdIdioma
            //    )
            //    VALUES(
            //        (SELECT ISNULL(MAX(Id), 0) FROM Usuario) + 1, @IdEntidad, @NoIdentificacionPersonal, @CorreoElectronico, @PrimerNombre, @SegundoNombre, @OtrosNombres, @PrimerApellido, @SegundoApellido,
            //        @ApellidoCasada, @Titulo, @Cargo, @Extension, @Telefono, @Activo, @Genero, @Password, @IdEstado, @IdUnidadAdministrativa, @RequiereCambioPassword,
            //        @FechaRegistro, @UsuarioRegistro, @IdIdioma
            //    )";

            //    string obtenerIdUsuarioSQL = @"
            //    SELECT Id 
            //    FROM Usuario 
            //    WHERE NoIdentificacionPersonal = @NoIdentificacionPersonal";

            //    string asignarRolesSQL = @"
            //    INSERT INTO RolUsuario (IdUsuario, IdEntidad, IdRol, FechaRegistro)
            //    VALUES(@IdUsuario, @IdEntidad, @IdRol, @FechaRegistro)";

            //    using (var trx = connection.BeginTransaction())
            //    {
            //        // Obtener información del usuario registro
            //        var usuarioRegistro = await ObtenerPorIdAsync(idUsuarioRegistro);

            //        // Guardar usuario
            //        await connection.ExecuteAsync(insertarUsuarioSQL, new
            //        {
            //            usuarioRegistro.IdEntidad,
            //            usuario.NoIdentificacionPersonal,
            //            usuario.CorreoElectronico,
            //            usuario.PrimerNombre,
            //            usuario.SegundoNombre,
            //            usuario.OtrosNombres,
            //            usuario.PrimerApellido,
            //            usuario.SegundoApellido,
            //            usuario.ApellidoCasada,
            //            usuario.Titulo,
            //            usuario.Cargo,
            //            usuario.Extension,
            //            usuario.Telefono,
            //            Activo = 0,
            //            usuario.Genero,
            //            Password = password,
            //            IdEstado = 1,
            //            //FechaFinInhabilitacion = DBNull.Value,
            //            usuario.IdUnidadAdministrativa,
            //            RequiereCambioPassword = 1,
            //            FechaRegistro = fechaRegistro,
            //            UsuarioRegistro = idUsuarioRegistro,
            //            usuarioRegistro.IdIdioma
            //        }, trx);

            //        // Obtener Id del usuario
            //        usuario.IdUsuario = await connection.QuerySingleAsync<int>(obtenerIdUsuarioSQL, new
            //        {
            //            usuario.NoIdentificacionPersonal
            //        }, trx);

            //        // Asignar Roles
            //        foreach (int idRol in usuario.ListaRoles)
            //        {
            //            await connection.ExecuteAsync(asignarRolesSQL, new
            //            {
            //                IdRol = idRol,
            //                usuarioRegistro.IdEntidad,
            //                usuario.IdUsuario,
            //                FechaRegistro = fechaRegistro
            //            }, trx);
            //        }

            //        trx.Commit();
            //    }

            //    return usuario.IdUsuario;
            //}

            return 1;
        }

        public Task<bool> DeleteAsync(int idEntidad, int idUsuario)
        {
            throw new NotImplementedException();
        }

        public Task<int> EditAsync(UserProfileModel user, DateTime createdDate)
        {
            throw new NotImplementedException();
        }

        public async Task<List<UsersListModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT 
	                usrp.Id
	                ,usrp.UserName
	                ,co.Name
	                ,co.MiddleName
	                ,co.LastName	
	                ,co.OtherName
                    ,co.WorkEmail
	                ,usrp.IsActive
	                ,usrp.IsDeleted
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

                var result = await connection.QueryAsync<UsersListModel>(sqlQuery, new
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
	                    [Id]
                        ,[UserName]
                        ,[PasswordHash]
                        ,[ContactId]
                        ,[Color]
                        ,[ProfilePicture]
                        ,[ProfilePictureContentType]
                        ,[IsInactive]
                        ,[IsPasswordChangeRequired]
                        ,[IsDeleted]
                        ,[CreatedDate]
                        ,[LastModifiedDate]
                        ,[CreatedByUserId]
                        ,[UpdatedByUserId]
                    FROM [UserProfile]
                    WHERE [UserName] = @userId
                ";
                var result = await connection.QueryAsync<UserProfileModel>(sqlQuery, new { userId });
                return result.FirstOrDefault();
            }
        }

        public async Task<UserProfileModel> GetByUserNameAsync(string userName)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"                    
                    SELECT 
                        [Id]
                        ,[UserName]
                        ,[PasswordHash]
                        ,[ContactId]
                        ,[Color]
                        ,[ProfilePicture]
                        ,[ProfilePictureContentType]
                        ,[IsInactive]
                        ,[IsPasswordChangeRequired]
                        ,[IsDeleted]
                        ,[CreatedDate]
                        ,[LastModifiedDate]
                        ,[CreatedByUserId]
                        ,[UpdatedByUserId]
                    FROM [UserProfile]
                    WHERE [UserName] = @userName
                ";
                var result = await connection.QueryAsync<UserProfileModel>(sqlQuery, new { userName });
                return result.FirstOrDefault();
            }
        }
       
        /*       

        public async Task<int> CrearUsuarioAsync(UsuarioModelo usuario, String password, DateTime fechaRegistro, int idUsuarioRegistro)
        {
            
        }

        public async Task<int> EditarUsuarioAsync(UsuarioModelo usuario, DateTime fechaRegistro)
        {
            using (var connection = await connectionProvider.OpenAsync())
            {
                string editarUsuarioSQL = @"
                    UPDATE Usuario
                    SET 
                        CorreoElectronico = @CorreoElectronico, 
                        PrimerNombre = @PrimerNombre, 
                        SegundoNombre = @SegundoNombre, 
                        OtrosNombres = @OtrosNombres, 
                        PrimerApellido = @PrimerApellido, 
                        SegundoApellido = @SegundoApellido, 
                        ApellidoCasada = @ApellidoCasada, 
                        Titulo = @Titulo, 
                        Cargo = @Cargo, 
                        Extension = @Extension, 
                        Telefono = @Telefono, 
                        Genero = @Genero, 
                        IdUnidadAdministrativa = @IdUnidadAdministrativa,
                        Activo = @Activo
                    WHERE Id=@IdUsuario AND IdEntidad=@IdEntidad";

                string eliminarRolesActualesSQL = @"
                DELETE RolUsuario 
                WHERE IdUsuario = @IdUsuario AND IdEntidad = @IdEntidad";

                string asignarRolesSQL = @"
                INSERT INTO RolUsuario (IdUsuario, IdEntidad, IdRol, FechaRegistro)
                VALUES(@IdUsuario, @IdEntidad, @IdRol, @FechaRegistro)";

                using (var trx = connection.BeginTransaction())
                {

                    // Se actualiza el usuario
                    await connection.ExecuteAsync(editarUsuarioSQL, new
                    {
                        usuario.CorreoElectronico,
                        usuario.PrimerNombre,
                        usuario.SegundoNombre,
                        usuario.OtrosNombres,
                        usuario.PrimerApellido,
                        usuario.SegundoApellido,
                        usuario.ApellidoCasada,
                        usuario.Titulo,
                        usuario.Cargo,
                        usuario.Extension,
                        usuario.Telefono,
                        usuario.Genero,
                        usuario.IdUnidadAdministrativa,
                        usuario.IdEntidad,
                        usuario.IdUsuario,
                        usuario.Activo
                    }, trx);

                    // Se eliminan los roles actuales
                    await connection.ExecuteAsync(eliminarRolesActualesSQL, new
                    {
                        usuario.IdEntidad,
                        usuario.IdUsuario
                    }, trx);

                    // Asignar Roles
                    foreach (int idRol in usuario.ListaRoles)
                    {
                        await connection.ExecuteAsync(asignarRolesSQL, new
                        {
                            IdRol = idRol,
                            usuario.IdEntidad,
                            usuario.IdUsuario,
                            FechaRegistro = fechaRegistro
                        }, trx);
                    }

                    trx.Commit();
                }

                return usuario.IdUsuario;
            }
        }

        public async Task<List<UsuarioListaModelo>> ObtenerUsuariosAsync(int pagina, int cantidad, string buscarTexto)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string sqlQuery = @"
                SELECT * FROM
                (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY UPPER(Nombre)) AS r__
                    FROM
                    (
                        SELECT us.Id,
			                us.IdEntidad,
			                us.Id AS IdUsuario, 
			                us.NoIdentificacionPersonal AS NoIdentificacionPersonal, 
			                CONCAT(us.PrimerNombre, ' ', us.SegundoNombre, ' ', us.PrimerApellido, ' ', us.SegundoApellido) AS Nombre,
			                us.CorreoElectronico,
			                ISNULL(ua.Nombre, '') AS NombreUnidadAdministrativa,
			                us.Activo AS Estado,
			                us.FechaRegistro,
		                COUNT(*) OVER () AS CantidadTotal
		                FROM Usuario us
		                LEFT JOIN UnidadAdministrativa ua ON us.IdUnidadAdministrativa = ua.Id
		                WHERE @BuscarTexto = '*' 
		                OR us.NoIdentificacionPersonal LIKE '%' + @BuscarTexto + '%'
		                OR CONCAT(us.PrimerNombre, ' ', us.SegundoNombre, ' ', us.PrimerApellido, ' ', us.SegundoApellido) LIKE '%' + @BuscarTexto + '%'
		                OR us.CorreoElectronico LIKE '%' +@BuscarTexto + '%'
		                OR ua.Nombre LIKE '%' + @BuscarTexto + '%'
                    ) a
                ) AS Temp
                WHERE r__ >= (((@Pagina-1) * @Cantidad) + 1) AND r__ < ((@Pagina * @Cantidad) + 1)";

                if (String.IsNullOrEmpty(buscarTexto))
                    buscarTexto = "*";

                var result = await connection.QueryAsync<UsuarioListaModelo>(sqlQuery, new { 
                    Pagina = pagina,
                    Cantidad = cantidad,
                    BuscarTexto = buscarTexto
                });

                return result.ToList();
            }
        }

        public async Task<bool> EliminarUsuarioAsync(int idEntidad, int idUsuario)
        {
            //TODO: verificar si es eliminacion logica

            using (var connection = await connectionProvider.OpenAsync())
            {

                string eliminarRolesActualesSQL = @"DELETE AD_ROLES_USUARIO WHERE ID_ENTIDAD = :IdEntidad AND ID_USUARIO = :IdUsuario";
                string eliminarUsuarioSQL = @"DELETE AD_USUARIOS WHERE ID_ENTIDAD = :idEntidad AND ID_USUARIO = :idUsuario";

                using (var trx = connection.BeginTransaction())
                {
                    // Se eliminan los roles actuales
                    await connection.ExecuteAsync(eliminarRolesActualesSQL, new
                    {
                        idEntidad,
                        idUsuario
                    }, trx);

                    // Se elimina el usuario
                    await connection.ExecuteAsync(eliminarUsuarioSQL, new
                    {
                        idEntidad,
                        idUsuario
                    }, trx);

                    trx.Commit();
                }
                return true;
            }
        }

        public async Task<UsuarioModelo> ObtenerUsuarioAsync(int idUsuario)
        {
            SqlMapper.AddTypeMap(typeof(bool), DbType.Byte);

            using (var connection = await connectionProvider.OpenAsync())
            {
                string obtenerUsuarioSQL = @"
                SELECT 
                    Id AS IdUsuario,
	                IdEntidad,	                                    
	                NoIdentificacionPersonal,
	                CorreoElectronico,
	                PrimerNombre,
	                SegundoNombre,
	                OtrosNombres,
	                PrimerApellido,
	                SegundoApellido,
	                ApellidoCasada,
	                Titulo,
	                Cargo,
	                Extension,
	                Telefono,
	                Genero,
                    Activo,
	                IdEstado,
	                IdUnidadAdministrativa
                FROM Usuario WHERE Id = @IdUsuario";

                string obtenerIdRolUsuario = @"
                SELECT IdRol 
                FROM RolUsuario 
                WHERE IdUsuario = @IdUsuario 
                ";

                var resultadoUsuario = await connection.QueryAsync<UsuarioModelo>(obtenerUsuarioSQL, new
                {
                    IdUsuario = idUsuario
                });

                var usuario = resultadoUsuario.FirstOrDefault();

                var resultadoRoles = await connection.QueryAsync<int>(obtenerIdRolUsuario, new
                {
                    IdUsuario = idUsuario
                });

                usuario.ListaRoles = resultadoRoles.ToList();

                return usuario;
            }
        }

        */
    }
}