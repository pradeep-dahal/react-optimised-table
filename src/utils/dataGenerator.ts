export interface SubtaskData {
  id: number;
  name: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
}

export interface RowData {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  location: string;
  startDate: string;
  salary: number;
  performance: number;
  status: string;
  unit: {
    qty: number;
    rate: number;
    totalSum: number;
  };
  product: {
    id: string;
    category: string;
    subcategory: string;
    price: number;
  };
  order: {
    date: string;
    quantity: number;
    discount: number;
    total: number;
  };
  vendor: {
    name: string;
    rating: number;
    lastDelivery: string;
  };
  metrics: {
    sales: number;
    growth: number;
    target: number;
    achievement: number;
  };
  subtasks?: SubtaskData[];
  [key: string]: unknown;
}

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Product",
  "Legal",
];
const positions = [
  "Manager",
  "Director",
  "Associate",
  "Specialist",
  "Coordinator",
  "Analyst",
  "Lead",
  "VP",
];
const locations = [
  "New York",
  "San Francisco",
  "London",
  "Tokyo",
  "Berlin",
  "Toronto",
  "Sydney",
  "Singapore",
];
const statuses = [
  "Active",
  "On Leave",
  "Probation",
  "Contract",
  "Terminated",
  "Remote",
  "Part-time",
];
const productCategories = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Food",
  "Books",
  "Sports",
  "Beauty",
  "Toys",
];
const productSubcategories = [
  "Premium",
  "Standard",
  "Budget",
  "Luxury",
  "Eco-friendly",
  "Handmade",
  "Imported",
];
const vendorNames = [
  "Acme Corp",
  "GlobalTech",
  "EcoSystems",
  "Prime Supplies",
  "Tech Innovations",
  "Quality Goods",
];

const priorities = ["High", "Medium", "Low", "Critical", "Blocker"];
const taskStatuses = [
  "Not Started",
  "In Progress",
  "Blocked",
  "Completed",
  "Deferred",
];

const getRandomDate = () => {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 5);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split("T")[0];
};

const generateRandomSubtask = (
  parentId: number,
  subtaskId: number
): SubtaskData => {
  return {
    id: subtaskId,
    name: `Subtask ${subtaskId} of Task ${parentId}`,
    status: taskStatuses[Math.floor(Math.random() * taskStatuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    dueDate: getRandomDate(),
    assignee: `Employee${Math.floor(Math.random() * 100)}`,
    progress: Math.floor(Math.random() * 100),
    estimatedHours: Math.floor(Math.random() * 40) + 1,
    actualHours: Math.floor(Math.random() * 50) + 1,
  };
};

const generateRandomRow = (id: number): RowData => {
  const firstName = `FirstName${id}`;
  const lastName = `LastName${id % 1000}`;
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  const qty = Math.floor(Math.random() * 100) + 1;
  const rate = Math.floor(Math.random() * 1000) + 10;
  const totalSum = qty * rate;

  // Generate between 0-5 subtasks for each row (some rows will have no subtasks)
  const subtaskCount = Math.floor(Math.random() * 6);
  const subtasks: SubtaskData[] = [];

  for (let i = 0; i < subtaskCount; i++) {
    subtasks.push(generateRandomSubtask(id, id * 100 + i + 1));
  }

  return {
    id,
    name,
    email,
    department: departments[Math.floor(Math.random() * departments.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    startDate: getRandomDate(),
    salary: Math.floor(Math.random() * 150000) + 30000,
    performance: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    unit: {
      qty,
      rate,
      totalSum,
    },
    product: {
      id: `PROD-${Math.floor(Math.random() * 10000)}`,
      category:
        productCategories[Math.floor(Math.random() * productCategories.length)],
      subcategory:
        productSubcategories[
          Math.floor(Math.random() * productSubcategories.length)
        ],
      price: Math.floor(Math.random() * 1000) + 10,
    },
    order: {
      date: getRandomDate(),
      quantity: Math.floor(Math.random() * 20) + 1,
      discount: Math.floor(Math.random() * 30),
      total: Math.floor(Math.random() * 5000) + 100,
    },
    vendor: {
      name: vendorNames[Math.floor(Math.random() * vendorNames.length)],
      rating: Math.floor(Math.random() * 5) + 1,
      lastDelivery: getRandomDate(),
    },
    metrics: {
      sales: Math.floor(Math.random() * 500000),
      growth: Math.floor(Math.random() * 30),
      target: Math.floor(Math.random() * 1000000),
      achievement: Math.floor(Math.random() * 120),
    },
    subtasks: subtasks.length > 0 ? subtasks : undefined,
  };
};

export const generateData = (count: number = 6000): RowData[] => {
  const data: RowData[] = [];
  for (let i = 0; i < count; i++) {
    data.push(generateRandomRow(i + 1));
  }
  return data;
};

export const getColumnGroups = () => {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
    },
    {
      field: "position",
      headerName: "Position",
      width: 150,
    },
    {
      field: "location",
      headerName: "Location",
      width: 150,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 120,
    },
    {
      field: "salary",
      headerName: "Salary",
      width: 120,
    },
    {
      field: "performance",
      headerName: "Performance",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      headerName: "Unit",
      children: [
        { field: "unit.qty", headerName: "Qty", width: 100 },
        { field: "unit.rate", headerName: "Rate", width: 100 },
        { field: "unit.totalSum", headerName: "Total Sum", width: 120 },
      ],
    },
    {
      headerName: "Product",
      children: [
        { field: "product.id", headerName: "Product ID", width: 120 },
        { field: "product.category", headerName: "Category", width: 130 },
        { field: "product.subcategory", headerName: "Subcategory", width: 140 },
        { field: "product.price", headerName: "Price", width: 100 },
      ],
    },
    {
      headerName: "Order",
      children: [
        { field: "order.date", headerName: "Date", width: 110 },
        { field: "order.quantity", headerName: "Quantity", width: 100 },
        { field: "order.discount", headerName: "Discount %", width: 110 },
        { field: "order.total", headerName: "Total", width: 100 },
      ],
    },
    {
      headerName: "Vendor",
      children: [
        { field: "vendor.name", headerName: "Vendor", width: 150 },
        { field: "vendor.rating", headerName: "Rating", width: 100 },
        {
          field: "vendor.lastDelivery",
          headerName: "Last Delivery",
          width: 130,
        },
      ],
    },
    {
      headerName: "Metrics",
      children: [
        { field: "metrics.sales", headerName: "Sales", width: 120 },
        { field: "metrics.growth", headerName: "Growth %", width: 100 },
        { field: "metrics.target", headerName: "Target", width: 120 },
        {
          field: "metrics.achievement",
          headerName: "Achievement %",
          width: 140,
        },
      ],
    },
  ];
};

// Helper function to check if a row has subtasks
export const hasSubtasks = (row: RowData): boolean => {
  return !!row.subtasks && row.subtasks.length > 0;
};

// Helper function to get subtask columns
export const getSubtaskColumns = () => {
  return [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Subtask Name", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "priority", headerName: "Priority", width: 100 },
    { field: "dueDate", headerName: "Due Date", width: 120 },
    { field: "assignee", headerName: "Assignee", width: 150 },
    { field: "progress", headerName: "Progress", width: 100 },
    { field: "estimatedHours", headerName: "Est. Hours", width: 100 },
    { field: "actualHours", headerName: "Actual Hours", width: 100 },
  ];
};

export const measureRenderTime = () => {
  const startTime = performance.now();
  return () => {
    const endTime = performance.now();
    return endTime - startTime;
  };
};
