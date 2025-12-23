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

        public async Task<ContactModel> CreateAsync(ContactModel contact, int currentUserId)
        {
            return await _contactsData.CreateAsync(contact, currentUserId);
        }

        public async Task<bool> DeleteAsync(int contactId, int currentUserId)
        {
            return await _contactsData.DeleteAsync(contactId, currentUserId);
        }

        public async Task<List<ContactModel>> GetAllAsync(int offset, int fetch, string searchText, bool? isSupplier)
        {
            return await _contactsData.GetAllAsync(offset, fetch, searchText, isSupplier);
        }

        public async Task<ContactModel> GetByIdAsync(int contactId)
        {
            return await _contactsData.GetByIdAsync(contactId);
        }

        public async Task<ContactModel> UpdateAsync(ContactModel contact, int currentUserId)
        {
            return await _contactsData.UpdateAsync(contact, currentUserId);
        }
    }
}
