// Mock Convex implementation for development
import { ref, computed } from 'vue'

export function useQuery(queryFn: any, argsFn: any, options: any = {}) {
  const data = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  // Mock data based on the query
  setTimeout(() => {
    if (queryFn.toString().includes('getCustomers')) {
      data.value = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-0123',
          customerType: 'residential',
          status: 'active',
          totalJobs: 5,
          totalSpent: 2500,
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'USA'
          }
        }
      ]
    } else if (queryFn.toString().includes('getJobs')) {
      data.value = [
        {
          _id: '1',
          jobNumber: 'JOB-001',
          title: 'Kitchen Renovation',
          status: 'in_progress',
          priority: 'high',
          customer: { firstName: 'John', lastName: 'Doe' },
          assignedToUsers: [],
          scheduledStart: Date.now() + 86400000,
          scheduledEnd: Date.now() + 172800000,
          location: { address: '123 Main St, Anytown, CA' }
        }
      ]
    } else if (queryFn.toString().includes('getQuotes')) {
      data.value = [
        {
          _id: '1',
          quoteNumber: 'QUO-001',
          title: 'Kitchen Renovation Quote',
          status: 'sent',
          customerId: '1',
          issueDate: Date.now(),
          expiryDate: Date.now() + 2592000000,
          subtotal: 5000,
          taxRate: 0.1,
          totalAmount: 5500
        }
      ]
    } else if (queryFn.toString().includes('getInvoices')) {
      data.value = [
        {
          _id: '1',
          invoiceNumber: 'INV-001',
          title: 'Kitchen Renovation Invoice',
          status: 'sent',
          customerId: '1',
          issueDate: Date.now(),
          dueDate: Date.now() + 2592000000,
          subtotal: 5000,
          taxRate: 0.1,
          totalAmount: 5500,
          amountPaid: 0,
          balanceDue: 5500
        }
      ]
    } else if (queryFn.toString().includes('getInventory')) {
      data.value = [
        {
          _id: '1',
          name: 'Electrical Wire',
          sku: 'WIRE-001',
          category: 'electrical',
          currentStock: 100,
          minStockLevel: 20,
          unitCost: 2.50,
          sellingPrice: 5.00
        }
      ]
    } else if (queryFn.toString().includes('getSchedules')) {
      data.value = [
        {
          _id: '1',
          title: 'Team Meeting',
          type: 'meeting',
          start: Date.now() + 3600000,
          end: Date.now() + 7200000,
          location: 'Office'
        }
      ]
    } else if (queryFn.toString().includes('getTeamMembers')) {
      data.value = [
        {
          _id: '1',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'manager',
          phoneNumber: '555-0124'
        }
      ]
    } else if (queryFn.toString().includes('getMessages')) {
      data.value = [
        {
          _id: '1',
          content: 'Welcome to the team!',
          sender: { firstName: 'Admin', lastName: 'User' },
          sentAt: Date.now() - 3600000
        }
      ]
    } else if (queryFn.toString().includes('getDocuments')) {
      data.value = [
        {
          _id: '1',
          name: 'Contract Template.pdf',
          type: 'contract',
          uploadedAt: Date.now() - 86400000,
          uploadedBy: { firstName: 'Admin', lastName: 'User' },
          url: '#'
        }
      ]
    }
    isLoading.value = false
  }, 100)

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      isLoading.value = true
      setTimeout(() => {
        isLoading.value = false
      }, 100)
    }
  }
}

export function useMutation(mutationFn: any) {
  const mutate = async (args: any) => {
    console.log('Mock mutation:', mutationFn, args)
    return { _id: 'mock-id' }
  }

  return {
    value: {
      mutate
    }
  }
}

export function useAction(actionFn: any) {
  const mutate = async (args: any) => {
    console.log('Mock action:', actionFn, args)
    return { success: true }
  }

  return {
    value: {
      mutate
    }
  }
}