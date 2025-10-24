export const initialApprovalWorkflow = {
  workflowId: 'wf_001',
  documentId: 'doc_001',
  steps: [
    {
      id: 'step_1',
      role: 'Legal Review',
      assignee: {
        name: 'Sarah Chen',
        email: 'sarah.chen@acmetech.com',
        title: 'Legal Counsel'
      },
      status: 'approved',
      approvedAt: '2025-10-20T14:30:00Z'
    },
    {
      id: 'step_2',
      role: 'Finance Review',
      assignee: {
        name: 'Michael Torres',
        email: 'michael.torres@acmetech.com',
        title: 'CFO'
      },
      status: 'approved',
      approvedAt: '2025-10-21T10:15:00Z'
    },
    {
      id: 'step_3',
      role: 'Executive Approval',
      assignee: {
        name: 'You',
        email: 'you@acmetech.com',
        title: 'VP of Operations'
      },
      status: 'pending',
      approvedAt: null
    },
    {
      id: 'step_4',
      role: 'Customer Signature',
      assignee: {
        name: 'Jane Doe',
        email: 'jane.doe@innovate.com',
        title: 'VP Operations'
      },
      status: 'waiting',
      approvedAt: null
    }
  ]
};

