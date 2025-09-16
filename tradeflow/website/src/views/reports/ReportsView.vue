<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Reports
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View analytics and generate business reports
        </p>
      </div>
    </div>

    <!-- Report Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ChartBarIcon class="h-8 w-8 text-primary-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Revenue Report</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Track income and expenses</p>
          </div>
        </div>
        <div class="mt-4">
          <button type="button" class="btn-primary w-full" @click="generateRevenueReport">
            Generate Report
          </button>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UsersIcon class="h-8 w-8 text-primary-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Customer Report</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Customer analytics and insights</p>
          </div>
        </div>
        <div class="mt-4">
          <button type="button" class="btn-primary w-full" @click="generateCustomerReport">
            Generate Report
          </button>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ClipboardDocumentListIcon class="h-8 w-8 text-primary-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Job Report</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Job performance and completion rates</p>
          </div>
        </div>
        <div class="mt-4">
          <button type="button" class="btn-primary w-full" @click="generateJobReport">
            Generate Report
          </button>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CubeIcon class="h-8 w-8 text-primary-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Inventory Report</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Stock levels and usage</p>
          </div>
        </div>
        <div class="mt-4">
          <button type="button" class="btn-primary w-full" @click="generateInventoryReport">
            Generate Report
          </button>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <DocumentTextIcon class="h-8 w-8 text-primary-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Invoice Report</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Payment tracking and aging</p>
          </div>
        </div>
        <div class="mt-4">
          <button type="button" class="btn-primary w-full" @click="generateInvoiceReport">
            Generate Report
          </button>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UserGroupIcon class="h-8 w-8 text-primary-600" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Team Report</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Team performance and productivity</p>
          </div>
        </div>
        <div class="mt-4">
          <button type="button" class="btn-primary w-full" @click="generateTeamReport">
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card p-5">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Revenue (MTD)</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">$12,500</dd>
      </div>
      <div class="card p-5">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Jobs</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">24</dd>
      </div>
      <div class="card p-5">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Completed Jobs</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">156</dd>
      </div>
      <div class="card p-5">
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Outstanding Invoices</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">$8,750</dd>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="card p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Reports</h3>
      <div class="text-center py-8">
        <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports generated yet</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Generate your first report using the options above.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChartBarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

const generateRevenueReport = () => {
  alert('Revenue report generation will be implemented here')
}

const generateCustomerReport = () => {
  alert('Customer report generation will be implemented here')
}

const generateJobReport = () => {
  alert('Job report generation will be implemented here')
}

const generateInventoryReport = () => {
  alert('Inventory report generation will be implemented here')
}

const generateInvoiceReport = () => {
  alert('Invoice report generation will be implemented here')
}

const generateTeamReport = () => {
  alert('Team report generation will be implemented here')
}
</script>