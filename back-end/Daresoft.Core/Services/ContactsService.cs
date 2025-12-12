using Daresoft.Core.Models;
using Daresoft.Core.Data;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Daresoft.Core.Services
{
    public class ContactsService : IContactsService
    {
        private readonly IContactsData _contactsData;

        public ContactsService(IContactsData contactsData)
        {
            _contactsData = contactsData;            
        }

        public Task<int> CreateAsync(ContactModel contact, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(int contactId, int currentUserId)
        {
            throw new NotImplementedException();
        }

        public Task<List<ContactModel>> GetAllAsync(int offset, int fetch, string searchText)
        {
            throw new NotImplementedException();
        }

        public async Task<ContactModel> GetByIdAsync(int contactId)
        {
            return await _contactsData.GetByIdAsync(contactId);
        }

        public Task<int> UpdateAsync(ContactModel contact, int currentUserId)
        {
            throw new NotImplementedException();
        }
    }
}
