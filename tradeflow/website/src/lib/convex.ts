import { ConvexClient } from 'convex/browser'

const convexUrl = import.meta.env.VITE_CONVEX_URL
if (!convexUrl) {
  throw new Error('VITE_CONVEX_URL is missing in .env')
}

export const convex = new ConvexClient(convexUrl)

// Mock API object for development
export const api = {
  customers: {
    getCustomers: 'customers:getCustomers',
    getCustomerById: 'customers:getCustomerById',
    createCustomer: 'customers:createCustomer',
    updateCustomer: 'customers:updateCustomer',
    deleteCustomer: 'customers:deleteCustomer',
  },
  jobs: {
    getJobs: 'jobs:getJobs',
    getJobById: 'jobs:getJobById',
    createJob: 'jobs:createJob',
    updateJob: 'jobs:updateJob',
    updateJobStatus: 'jobs:updateJobStatus',
  },
  quotes: {
    getQuotes: 'quotes:getQuotes',
    getQuoteById: 'quotes:getQuoteById',
    createQuote: 'quotes:createQuote',
    updateQuote: 'quotes:updateQuote',
    updateQuoteStatus: 'quotes:updateQuoteStatus',
  },
  invoices: {
    getInvoices: 'invoices:getInvoices',
    getInvoiceById: 'invoices:getInvoiceById',
    createInvoice: 'invoices:createInvoice',
    updateInvoice: 'invoices:updateInvoice',
    updateInvoiceStatus: 'invoices:updateInvoiceStatus',
  },
  inventory: {
    getInventory: 'inventory:getInventory',
    getInventoryItemById: 'inventory:getInventoryItemById',
    createInventoryItem: 'inventory:createInventoryItem',
    updateInventoryItem: 'inventory:updateInventoryItem',
    deleteInventoryItem: 'inventory:deleteInventoryItem',
    adjustStock: 'inventory:adjustStock',
  },
  schedules: {
    getSchedules: 'schedules:getSchedules',
    getScheduleById: 'schedules:getScheduleById',
    createSchedule: 'schedules:createSchedule',
    updateSchedule: 'schedules:updateSchedule',
    deleteSchedule: 'schedules:deleteSchedule',
  },
  users: {
    getTeamMembers: 'users:getTeamMembers',
    getUserById: 'users:getUserById',
    updateUserProfile: 'users:updateUserProfile',
  },
  messages: {
    getMessages: 'messages:getMessages',
    sendMessage: 'messages:sendMessage',
    markAsRead: 'messages:markAsRead',
    getUnreadCount: 'messages:getUnreadCount',
  },
  documents: {
    getDocuments: 'documents:getDocuments',
    getDocumentById: 'documents:getDocumentById',
    createDocument: 'documents:createDocument',
    updateDocument: 'documents:updateDocument',
    deleteDocument: 'documents:deleteDocument',
  },
  companies: {
    getCompany: 'companies:getCompany',
    updateCompany: 'companies:updateCompany',
  },
  actions: {
    email: {
      sendEmail: 'actions:email:sendEmail',
    },
  },
}
