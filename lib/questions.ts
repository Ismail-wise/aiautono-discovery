export type Department = 'Finance' | 'Sales' | 'HR' | 'Inventory' | 'Customer Service' | 'Marketing' | 'Operations' | 'Other';

export const departments: Department[] = ['Finance','Sales','HR','Inventory','Customer Service','Marketing','Operations','Other'];

type Question = { id: string; label: string; help: string; placeholder?: string };

const common = (processLabel: string): Question[] => [
  { id: 'process', label: processLabel, help: 'Describe the current process in simple words.', placeholder: 'Explain what happens today, step by step.' },
  { id: 'people', label: 'Who is involved?', help: 'Roles or teams are enough.', placeholder: 'Example: Owner, sales staff, accountant' },
  { id: 'tools', label: 'What tools do you use now?', help: 'List software, spreadsheets, chat apps, paper, or other tools.', placeholder: 'Example: Excel, LINE, Facebook, QuickBooks' },
  { id: 'volume', label: 'How much work happens normally?', help: 'A rough daily, weekly, or monthly estimate is enough.', placeholder: 'Example: 100 requests per week' },
  { id: 'problems', label: 'What goes wrong most often?', help: 'Think about delays, mistakes, duplicated work, or missed follow-ups.', placeholder: 'Example: Staff forget to update status' },
  { id: 'success', label: 'What result would make this project successful?', help: 'Describe the business result, not the technology.', placeholder: 'Example: I can see the status instantly and save 10 hours per week' },
];

export const questions: Record<Department, Question[]> = {
  Finance: common('Which finance process do you want to improve?'),
  Sales: common('What happens after a new sales lead arrives?'),
  HR: common('Which HR process do you want to improve?'),
  Inventory: common('How do you manage stock today?'),
  'Customer Service': common('How do you handle customer requests today?'),
  Marketing: common('Which marketing process do you want to improve?'),
  Operations: common('Which daily operation do you want to improve?'),
  Other: common('Which business process do you want to improve?'),
};
